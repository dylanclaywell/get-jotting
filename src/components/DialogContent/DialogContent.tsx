import { JSXElement } from 'solid-js'

import styles from './DialogContent.module.css'

export interface Props {
  children: JSXElement
}

export default function DialogContent(props: Props) {
  return <div class={styles['dialog-content']}>{props.children}</div>
}
