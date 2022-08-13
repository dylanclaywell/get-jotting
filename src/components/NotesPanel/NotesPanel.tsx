import { Accessor, For, Show } from 'solid-js'
import { FileEntry } from '@tauri-apps/api/fs'

import Icon from '../Icon'
import { Note } from '../../types'

import styles from './NotesPanel.module.css'

export interface Props {
  shouldShowNotes: boolean
  getNotes: Accessor<Note[]>
  getSelectedFolderId: Accessor<string | null>
  getSelectedNoteId: Accessor<string | null>
  selectNote: (noteId: string) => void
  createNote: (name: string, folderId: string) => void
  onFocus: (panel: 'notes' | 'note' | 'folders') => void
}

export default function NotesPanel(props: Props) {
  return (
    <div class={styles['notes-panel']} onClick={() => props.onFocus('notes')}>
      <Show when={props.shouldShowNotes}>
        <div class={styles['notes-panel__notes']}>
          <For each={props.getNotes()}>
            {(note) => (
              <button
                class={styles['notes-panel__note']}
                classList={{
                  [styles['notes-panel__note--selected']]:
                    props.getSelectedNoteId() === note.id,
                }}
                onClick={() => props.selectNote(note.id)}
              >
                <span class={styles['notes-panel__note__label']}>
                  {note.name || 'Title'}
                </span>
              </button>
            )}
          </For>
        </div>
        <div class={styles['note-panel__add-note-button-wrapper']}>
          <div class={styles['notes-panel__add-note-button-container']}>
            <button
              class={styles['notes-panel__add-note-button']}
              onClick={() => {
                const folderId = props.getSelectedFolderId()
                if (folderId) {
                  props.createNote('New Note', folderId)
                }
              }}
            >
              <Icon
                name="file-plus"
                width="20"
                height="20"
                className={styles['notes-panel__add-note-button__icon']}
              />
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
