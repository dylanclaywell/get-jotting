import { children, For, JSXElement } from 'solid-js'

import styles from './DialogActions.module.css'

export interface Action {
  label: string
  onClick: () => void
  color?: 'primary' | 'secondary'
}

export interface Props {
  children: (action: Action) => JSXElement
  actions: Action[]
}

export default function DialogActions(props: Props) {
  return (
    <div class={styles['dialog-actions']}>
      <For each={props.actions}>{(action) => props.children(action)}</For>
    </div>
  )
}
