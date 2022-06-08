import { Component, createSignal } from 'solid-js'
import { readDir, createDir, FileEntry } from '@tauri-apps/api/fs'
import { dataDir, resolve } from '@tauri-apps/api/path'
import { invoke } from '@tauri-apps/api'
import { v4 as generatedUuid } from 'uuid'

import FoldersPanel from './components/FoldersPanel'
import NotesPanel from './components/NotesPanel'

import styles from './App.module.css'

interface Note {
  /** The id is also the filename */
  id: string
  name: string
  dateCreated: string
  text?: string
  path: string
  children?: FileEntry[]
}

async function readDirectory(path: string) {
  try {
    const data = await readDir(path)
    return data
  } catch {
    return []
  }
}

async function initializeDirectory(path: string) {
  try {
    const data = await readDir(path)

    return data
  } catch (e) {
    if (
      typeof e === 'string' &&
      /The system cannot find the path specified/.test(e)
    ) {
      await createDir(path)
    }

    return []
  }
}

// TODO create Rust API endpoints instead of using the path API directly here
const App: Component = () => {
  const [getSelectedNoteIndex, setSelectedNoteIndex] = createSignal<
    number | null
  >(null)
  const [getSelectedFolderIndex, setSelectedFolderIndex] = createSignal<
    number | null
  >(null)
  const [getFolders, setFolders] = createSignal<FileEntry[]>([])
  const [getNotes, setNotes] = createSignal<Note[]>([])

  function getFoldersFromFilesystem() {
    dataDir().then(async (path) => {
      const appPath = await resolve(path, 'dev.get-writing')
      const notesPath = await resolve(path, 'dev.get-writing', 'notes')

      await initializeDirectory(appPath)
      const files = await initializeDirectory(notesPath)

      setFolders(files.filter((file) => Boolean(file.children)))
    })
  }

  async function getNotesFromFilesystem(path: string) {
    const files = await readDirectory(path)

    const validFiles = files.filter((file) => file.children)

    setNotes(
      validFiles.map((file) => {
        return {
          id: file.name ?? '',
          name: 'Blah',
          dateCreated: '2020-01-01',
          text: '',
          path: file.path,
          children: file.children,
        }
      })
    )
  }

  getFoldersFromFilesystem()

  function selectFolder(index: number, path: string) {
    setSelectedNoteIndex(null)
    setSelectedFolderIndex(index)
    getNotesFromFilesystem(path)
  }

  function selectNote(index: number, path: string) {
    setSelectedNoteIndex(index)
  }

  async function createFolder(name: string) {
    const path = await dataDir()
    const folderPath = await resolve(path, 'dev.get-writing', 'notes', name)

    try {
      await createDir(folderPath)
      await invoke('create_folder', {
        name: name,
      })
    } catch (error) {
      console.log(error)
      if (
        typeof error === 'string' &&
        /Cannot create a file when that file already exists/.test(error)
      ) {
        // TODO display a message about a duplicate folder
      }
    }

    getFoldersFromFilesystem()
  }

  async function createNote(name: string) {
    const path = await dataDir()
    const folderPath = await resolve(
      path,
      'dev.get-writing',
      'notes',
      generatedUuid()
    )

    try {
      await createDir(folderPath)
      await invoke('create_note', {
        name,
        folderId: '',
        text: '',
      })
    } catch (error) {
      if (
        typeof error === 'string' &&
        /Cannot create a file when that file already exists/.test(error)
      ) {
        // TODO display a message about a duplicate folder
      }
    }

    const currentFolder = getFolders().find(
      (f, index) => index === getSelectedFolderIndex()
    )

    if (currentFolder) {
      getNotesFromFilesystem(currentFolder?.path)
    }
  }

  return (
    <div class={styles['app']}>
      <FoldersPanel
        getFolders={getFolders}
        getSelectedFolderIndex={getSelectedFolderIndex}
        selectFolder={selectFolder}
        createFolder={createFolder}
      />
      <NotesPanel
        shouldShowNotes={Boolean(getSelectedFolderIndex() !== null)}
        getNotes={getNotes}
        getSelectedNoteIndex={getSelectedNoteIndex}
        selectNote={selectNote}
        createNote={createNote}
      />
      <div class={styles['note-panel']}></div>
    </div>
  )
}

export default App
