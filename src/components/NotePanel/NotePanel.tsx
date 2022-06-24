import { createSignal, Show } from 'solid-js'
import convertMarkdownToHtml from '../../lib/convertMarkdownToHtml'

import { Note } from '../../types'
import Icon from '../Icon'

import styles from './NotePanel.module.css'

interface Props {
  getSelectedNote: () => Note | undefined
  updateNoteName: (id: string, name: string) => void
  updateNoteText: (id: string, text: string) => void
  onFocus: (panel: 'notes' | 'note' | 'folders') => void
}

export default function NotePanel(props: Props) {
  const [getShouldShowMarkdown, setShouldShowMarkdown] = createSignal(false)
  const [getShouldShowControls, setShouldShowControls] = createSignal(true)

  function getNote() {
    return props.getSelectedNote()
  }

  function getRenderedText() {
    const text = getNote()?.text ?? ''
    return convertMarkdownToHtml(text)
  }

  return (
    <div
      class={styles['note-panel']}
      classList={{
        [styles['note-panel--rendered']]: getShouldShowMarkdown(),
      }}
      onClick={() => props.onFocus('note')}
    >
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
        <Show
          when={getShouldShowControls()}
          fallback={
            <div>
              <button
                onClick={() => {
                  setShouldShowControls(true)
                }}
                class={styles['note-panel--controls__expand-button']}
              >
                <Icon name="chevrons-down" width="16" height="16" />
              </button>
            </div>
          }
        >
          <div class={styles['note-panel--controls']}>
            <div>
              <button
                class={styles['note-panel--controls__button']}
                classList={{
                  [styles['note-panel--controls__button--active']]:
                    getShouldShowMarkdown(),
                }}
                onClick={() => setShouldShowMarkdown(!getShouldShowMarkdown())}
              >
                <Icon
                  name="type"
                  width="16"
                  height="16"
                  className={styles['note-panel--controls__icon']}
                />
              </button>
            </div>
            <button
              onClick={() => {
                setShouldShowControls(false)
              }}
              class={styles['note-panel--controls__collapse-button']}
            >
              <Icon name="chevrons-up" width="16" height="16" />
            </button>
          </div>
        </Show>
        <Show
          when={getShouldShowMarkdown()}
          fallback={
            <textarea
              class={styles['note-panel__text-input']}
              classList={{
                [styles['note-panel__text-input--taller']]:
                  !getShouldShowControls(),
              }}
              value={getNote()?.text}
              onInput={(event) => {
                const note = getNote()

                if (note) {
                  props.updateNoteText(note.id, event.currentTarget.value)
                }
              }}
            />
          }
        >
          <div
            class={styles['note-panel__rendered-text']}
            innerHTML={getRenderedText()}
          />
        </Show>
      </Show>
    </div>
  )
}
