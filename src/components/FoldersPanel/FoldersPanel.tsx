import { Accessor, createSignal, For, JSX, JSXElement, Show } from 'solid-js'
import { FileEntry } from '@tauri-apps/api/fs'

import Icon from '../Icon'

import styles from './FoldersPanel.module.css'
import NewFolderForm from './NewFolderForm'

export interface Props {
  getFolders: Accessor<FileEntry[]>
  selectFolder: (index: number, path: string) => void
  getSelectedFolderIndex: Accessor<number | null>
  createFolder: (name: string) => void
}

export default function FolderPanel(props: Props) {
  const [getIsAddingNewFolder, setIsAddingNewFolder] = createSignal(false)

  return (
    <div class={styles['folder-panel']}>
      <div>
        <h1 class={styles['folder-panel__header']}>Folders</h1>
        <div>
          <For each={props.getFolders()}>
            {(folder, getIndex) => (
              <button
                class={styles['folder-panel__folder']}
                classList={{
                  [styles['folder-panel__folder--selected']]:
                    getIndex() === props.getSelectedFolderIndex(),
                }}
                onClick={() => props.selectFolder(getIndex(), folder.path)}
              >
                <span class={styles['folder-panel__folder__label']}>
                  {folder.name}
                </span>
              </button>
            )}
          </For>
          <Show when={getIsAddingNewFolder()}>
            <NewFolderForm
              createFolder={props.createFolder}
              onClose={() => setIsAddingNewFolder(false)}
            />
          </Show>
        </div>
      </div>
      <button
        class={styles['folder-panel__add-folder-button']}
        onClick={() => setIsAddingNewFolder(true)}
      >
        <Icon
          className={styles['folder-panel__add-folder-button__icon']}
          name="plus-circle"
        />
        Add Folder
      </button>
    </div>
  )
}
