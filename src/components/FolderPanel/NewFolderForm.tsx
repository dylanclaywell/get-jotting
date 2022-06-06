import { createEffect, createSignal, onCleanup } from 'solid-js'

import styles from './NewFolderForm.module.css'

export interface Props {
  onClose: () => void
  createFolder: (name: string) => void
}

export default function NewFolderForm(props: Props) {
  const [getNewFolderNameInputRef, setNewFolderNameInputRef] =
    createSignal<HTMLInputElement | null>(null)
  const [getNewFolderName, setNewFolderName] = createSignal('')

  createEffect(() => {
    const input = getNewFolderNameInputRef()

    if (input) {
      input.focus()
    }
  })

  function onClick(event: MouseEvent) {
    if (event.target && event.target !== getNewFolderNameInputRef()) {
      const newFolderName = getNewFolderName()

      if (newFolderName) {
        props.createFolder(newFolderName)
      }
      props.onClose()
    }
  }

  document.addEventListener('click', onClick)

  onCleanup(() => {
    document.removeEventListener('click', onClick)
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        props.onClose()
        props.createFolder(getNewFolderName())
      }}
    >
      <input
        ref={(element) => setNewFolderNameInputRef(element)}
        onInput={(event) => setNewFolderName(event.currentTarget.value)}
        class={styles['new-folder-form__input']}
      />
    </form>
  )
}
