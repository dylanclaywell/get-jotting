import { Show } from 'solid-js'

import { Note } from '../../types'
import Dialog from '../Dialog'
import DialogActions from '../DialogActions'
import DialogContent from '../DialogContent'
import DialogHeader from '../DialogHeader'

import styles from './DeleteNoteDialog.module.css'

export interface Props {
  isOpen: boolean
  onClose: () => void
  selectedNote: Note | undefined
  deleteNote: () => void
}

export default function DeleteNoteDialog(props: Props) {
  return (
    <Show when={props.isOpen}>
      <Dialog onClose={props.onClose}>
        {(onClose) => (
          <>
            <DialogHeader>Delete Note</DialogHeader>
            <DialogContent>
              Are you sure you want to delete note{' '}
              <span class={styles['delete-note-dialog__note-name']}>
                {props.selectedNote?.name}
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
                    props.deleteNote()
                    onClose()
                  },
                  color: 'primary',
                },
              ]}
            >
              {(action) => (
                <button
                  class={styles['delete-note-dialog__action']}
                  classList={{
                    [styles['delete-note-dialog__delete-action']]:
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
