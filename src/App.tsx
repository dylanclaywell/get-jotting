import { Component, createSignal, For } from 'solid-js'
import { readDir, createDir, FileEntry } from '@tauri-apps/api/fs'
import { dataDir, resolve } from '@tauri-apps/api/path'

import styles from './App.module.css'
import Icon from './components/Icon'
import FolderPanel from './components/FolderPanel'

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
  const [getSelectedFolderIndex, setSelectedFolderIndex] = createSignal<
    number | null
  >(null)
  const [getFolders, setFolders] = createSignal<FileEntry[]>([])
  const [getNotes, setNotes] = createSignal<FileEntry[]>([])

  function getFoldersFromFile() {
    dataDir().then(async (path) => {
      const appPath = await resolve(path, 'dev.get-writing')
      const notesPath = await resolve(path, 'dev.get-writing', 'notes')

      await initializeDirectory(appPath)
      const files = await initializeDirectory(notesPath)

      setFolders(files.filter((file) => Boolean(file.children)))
    })
  }

  getFoldersFromFile()

  function selectFolder(index: number, path: string) {
    setSelectedFolderIndex(index)
    readDirectory(path).then((files) => {
      setNotes(files.filter((file) => !file.children))
    })
  }

  async function createFolder(name: string) {
    const path = await dataDir()
    const folderPath = await resolve(path, 'dev.get-writing', 'notes', name)

    try {
      await createDir(folderPath)
    } catch (error) {
      if (
        typeof error === 'string' &&
        /Cannot create a file when that file already exists/.test(error)
      ) {
        // TODO display a message about a duplicate folder
      }
    }

    getFoldersFromFile()
  }

  return (
    <div class={styles['app']}>
      <FolderPanel
        getFolders={getFolders}
        getSelectedFolderIndex={getSelectedFolderIndex}
        selectFolder={selectFolder}
        createFolder={createFolder}
      />
      <div class={styles['files-panel']}>
        <For each={getNotes()}>
          {(note) => (
            <button class={styles['notes']}>
              <span class={styles['notes__label']}>{note.name}</span>
            </button>
          )}
        </For>
      </div>
      <div class={styles['file-panel']}></div>
    </div>
  )
}

export default App
