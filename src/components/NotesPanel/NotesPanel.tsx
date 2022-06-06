import { Accessor, For, Show } from 'solid-js'
import { FileEntry } from '@tauri-apps/api/fs'

import Icon from '../Icon'

import styles from './NotesPanel.module.css'

export interface Props {
  shouldShowNotes: boolean
  getNotes: Accessor<FileEntry[]>
  getSelectedNoteIndex: Accessor<number | null>
  selectNote: (index: number, path: string) => void
  createNote: (name: string) => void
}

export default function NotesPanel(props: Props) {
  return (
    <div class={styles['notes-panel']}>
      <Show when={props.shouldShowNotes}>
        <button
          class={styles['notes-panel__add-note-button']}
          onClick={() => props.createNote('New Note')}
        >
          <Icon
            name="plus"
            width="20"
            height="20"
            className={styles['notes-panel__add-note-button__icon']}
          />
        </button>
        <For each={props.getNotes()}>
          {(note, getIndex) => (
            <button
              class={styles['notes-panel__note']}
              classList={{
                [styles['notes-panel__note--selected']]:
                  props.getSelectedNoteIndex() === getIndex(),
              }}
              onClick={() => props.selectNote(getIndex(), note.path)}
            >
              <span class={styles['notes-panel__note__label']}>
                {note.name}
              </span>
            </button>
          )}
        </For>
      </Show>
    </div>
  )
}
