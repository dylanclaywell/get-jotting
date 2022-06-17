import { JSXElement } from 'solid-js'
import { Portal } from 'solid-js/web'

import styles from './DialogHeader.module.css'

export interface Props {
  children: JSXElement
}

export default function DialogHeader(props: Props) {
  return <div class={styles['dialog-header']}>{props.children}</div>
}
