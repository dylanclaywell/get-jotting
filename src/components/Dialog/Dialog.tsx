import { JSXElement } from 'solid-js'
import { Portal } from 'solid-js/web'

import styles from './Dialog.module.css'

export interface Props {
  children: JSXElement
}

export default function Dialog(props: Props) {
  return (
    <Portal>
      <div class={styles.dialog}>{props.children}</div>
    </Portal>
  )
}
