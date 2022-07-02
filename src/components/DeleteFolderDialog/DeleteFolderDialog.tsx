import { Show } from 'solid-js'

import { Folder } from '../../types'
import Dialog from '../Dialog'
import DialogActions from '../DialogActions'
import DialogContent from '../DialogContent'
import DialogHeader from '../DialogHeader'

import styles from './DeleteFolderDialog.module.css'

export interface Props {
  isOpen: boolean
  onClose: () => void
  selectedFolder: Folder | undefined
  deleteFolder: () => void
}

export default function DeleteFolderDialog(props: Props) {
  return (
    <Show when={props.isOpen}>
      <Dialog onClose={props.onClose}>
        {(onClose) => (
          <>
            <DialogHeader>Delete Folder</DialogHeader>
            <DialogContent>
              Are you sure you want to delete folder{' '}
              <span class={styles['delete-folder-dialog__folder-name']}>
                {props.selectedFolder?.name}
              </span>
              ?
            </DialogContent>
            <DialogActions
              actions={[
                {
                  label: 'Cancel',
                  onClick: () => {
                    onClose()
                  },
                },
                {
                  label: 'Delete',
                  onClick: () => {
                    props.deleteFolder()
                    onClose()
                  },
                  color: 'primary',
                },
              ]}
            >
              {(action) => (
                <button
                  class={styles['delete-folder-dialog__action']}
                  classList={{
                    [styles['delete-folder-dialog__delete-action']]:
                      action.color === 'primary',
                  }}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Show>
  )
}
