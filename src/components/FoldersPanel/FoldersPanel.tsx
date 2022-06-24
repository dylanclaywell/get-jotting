import { Accessor, createSignal, For, Show } from 'solid-js'

import Icon from '../Icon'
import NewFolderForm from './NewFolderForm'
import { Folder } from '../../types'

import styles from './FoldersPanel.module.css'

export interface Props {
  getFolders: Accessor<Folder[]>
  selectFolder: (id: string) => void
  getFocusedObjectId: Accessor<string | null>
  getSelectedFolderId: Accessor<string | null>
  createFolder: (name: string) => void
  onFocus: (panel: 'notes' | 'note' | 'folders') => void
}

export default function FolderPanel(props: Props) {
  const [getIsAddingNewFolder, setIsAddingNewFolder] = createSignal(false)

  return (
    <div
      class={styles['folder-panel']}
      onClick={() => props.onFocus('folders')}
    >
      <div>
        <h1 class={styles['folder-panel__header']}>Folders</h1>
        <div>
          <For each={props.getFolders()}>
            {(folder) => (
              <button
                class={styles['folder-panel__folder']}
                classList={{
                  [styles['folder-panel__folder--selected']]:
                    folder.id === props.getSelectedFolderId(),
                  [styles['folder-panel__folder--focused']]:
                    folder.id === props.getFocusedObjectId(),
                }}
                onClick={() => props.selectFolder(folder.id)}
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
