import { Component, createSignal, For } from 'solid-js'
import { readDir, createDir, FileEntry } from '@tauri-apps/api/fs'
import { dataDir, resolve } from '@tauri-apps/api/path'

import styles from './App.module.css'
import Icon from './components/Icon'

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

const App: Component = () => {
  const [getSelectedFolderIndex, setSelectedFolderIndex] = createSignal<
    number | null
  >(null)
  const [getFolders, setFolders] = createSignal<FileEntry[]>([])
  const [getNotes, setNotes] = createSignal<FileEntry[]>([])

  dataDir().then(async (path) => {
    const appPath = await resolve(path, 'dev.get-writing')
    const notesPath = await resolve(path, 'dev.get-writing', 'notes')

    await initializeDirectory(appPath)
    const files = await initializeDirectory(notesPath)

    setFolders(files.filter((file) => Boolean(file.children)))
  })

  function selectFolder(index: number, path: string) {
    setSelectedFolderIndex(index)
    readDirectory(path).then((files) => {
      setNotes(files.filter((file) => !file.children))
    })
  }

  return (
    <div class={styles['app']}>
      <div class={styles['categories-panel']}>
        <h1 class={styles['app__panel-header']}>Categories</h1>
        <div>
          <For each={getFolders()}>
            {(folder, getIndex) => (
              <button
                class={styles['folder']}
                classList={{
                  [styles['folder--selected']]:
                    getIndex() === getSelectedFolderIndex(),
                }}
                onClick={() => selectFolder(getIndex(), folder.path)}
              >
                <span class={styles['folder__label']}>{folder.name}</span>
              </button>
            )}
          </For>
        </div>
      </div>
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
