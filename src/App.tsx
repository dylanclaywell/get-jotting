import { createSignal, onCleanup, Show } from 'solid-js'
import { invoke } from '@tauri-apps/api'

import FoldersPanel from './components/FoldersPanel'
import NotesPanel from './components/NotesPanel'
import { Folder, Note } from './types'

import styles from './App.module.css'
import NotePanel from './components/NotePanel'
import DeleteFolderDialog from './components/DeleteFolderDialog'

// TODO create Rust API endpoints instead of using the path API directly here
export default function App() {
  const [getDeleteFolderDialogIsOpen, setDeleteFolderDialogIsOpen] =
    createSignal(false)
  const [getSelectedNoteId, setSelectedNoteId] = createSignal<string | null>(
    null
  )
  const [getSelectedFolderId, setSelectedFolderId] = createSignal<
    string | null
  >(null)
  const [getFolders, setFolders] = createSignal<Folder[]>([])
  const [getNotes, setNotes] = createSignal<Note[]>([])

  function getSelectedNote() {
    return getNotes().find((n) => n.id === getSelectedNoteId())
  }

  function getSelectedFolder() {
    return getFolders().find((n) => n.id === getSelectedFolderId())
  }

  function getFoldersFromDatabase() {
    invoke('get_folders').then((folders) => {
      setFolders(JSON.parse(folders as any))
    })
  }

  function getNotesFromDatabase(folderId: string) {
    invoke('get_notes', {
      folderId: folderId,
    }).then((notes) => {
      setNotes(JSON.parse(notes as any))
    })
  }

  getFoldersFromDatabase()

  function selectFolder(id: string) {
    setSelectedNoteId(null)
    setSelectedFolderId(id)
    getNotesFromDatabase(id)
  }

  function selectNote(id: string) {
    setSelectedNoteId(id)
  }

  async function createFolder(name: string) {
    try {
      await invoke('create_folder', {
        name: name,
      })
    } catch (error) {
      console.log(error)
      // TODO display an error message
    }

    getFoldersFromDatabase()
  }

  async function createNote(name: string, folderId: string) {
    try {
      await invoke('create_note', {
        name,
        folderId,
        text: '',
      })
    } catch (error) {
      // TODO display an error message
    }

    const currentFolder = getFolders().find(
      (f) => f.id === getSelectedFolderId()
    )

    if (currentFolder) {
      getNotesFromDatabase(currentFolder?.id)
    }
  }

  async function updateNoteName(id: string, name: string) {
    try {
      await invoke('update_note_name', {
        id,
        name,
      })
    } catch (error) {
      // TODO display an error message
    }

    const currentFolder = getFolders().find(
      (f) => f.id === getSelectedFolderId()
    )

    if (currentFolder) {
      getNotesFromDatabase(currentFolder?.id)
    }
  }

  async function updateNoteText(id: string, text: string) {
    try {
      await invoke('update_note_text', {
        id,
        text,
      })
    } catch (error) {
      // TODO display an error message
    }

    const currentFolder = getFolders().find(
      (f) => f.id === getSelectedFolderId()
    )

    if (currentFolder) {
      getNotesFromDatabase(currentFolder?.id)
    }
  }

  async function deleteSelectedFolder() {
    await invoke('delete_folder', { id: getSelectedFolderId() })
    getFoldersFromDatabase()
    setNotes([])
    setSelectedFolderId(null)
  }

  async function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Delete' && getSelectedFolderId() !== null) {
      setDeleteFolderDialogIsOpen(true)
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  onCleanup(() => document.removeEventListener('keydown', handleKeyDown))

  return (
    <div class={styles['app']}>
      <DeleteFolderDialog
        deleteFolder={deleteSelectedFolder}
        isOpen={getDeleteFolderDialogIsOpen()}
        selectedFolder={getSelectedFolder()}
        onClose={() => {
          setDeleteFolderDialogIsOpen(false)
        }}
      />
      <FoldersPanel
        getFolders={getFolders}
        getSelectedFolderId={getSelectedFolderId}
        selectFolder={selectFolder}
        createFolder={createFolder}
      />
      <NotesPanel
        shouldShowNotes={Boolean(getSelectedFolderId() !== null)}
        getNotes={getNotes}
        getSelectedFolderId={getSelectedFolderId}
        getSelectedNoteId={getSelectedNoteId}
        selectNote={selectNote}
        createNote={createNote}
      />
      <NotePanel
        getSelectedNote={getSelectedNote}
        updateNoteName={updateNoteName}
        updateNoteText={updateNoteText}
      />
    </div>
  )
}
