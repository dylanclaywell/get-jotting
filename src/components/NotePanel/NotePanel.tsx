import { Show } from 'solid-js'

import { Note } from '../../types'

import styles from './NotePanel.module.css'

interface Props {
  getSelectedNote: () => Note | undefined
  updateNoteName: (id: string, name: string) => void
  updateNoteText: (id: string, text: string) => void
}

export default function NotePanel(props: Props) {
  function getNote() {
    return props.getSelectedNote()
  }

  return (
    <div class={styles['note-panel']}>
      <Show when={Boolean(getNote())}>
        <input
          placeholder="Title"
          class={styles['note-panel__name-input']}
          value={getNote()?.name}
          onInput={(event) => {
            const note = getNote()

            if (note) {
              props.updateNoteName(note.id, event.currentTarget.value)
            }
          }}
        />
        <textarea
          class={styles['note-panel__text-input']}
          value={getNote()?.text}
          onInput={(event) => {
            const note = getNote()

            if (note) {
              props.updateNoteText(note.id, event.currentTarget.value)
            }
          }}
        />
      </Show>
    </div>
  )
}
