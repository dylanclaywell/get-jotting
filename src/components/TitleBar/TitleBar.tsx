import { appWindow } from '@tauri-apps/api/window'

import Icon from '../Icon'

import styles from './TitleBar.module.css'

export default function TitleBar() {
  return (
    <div data-tauri-drag-region id="titlebar" class={styles['titlebar']}>
      <div
        class={styles['titlebar__button']}
        onClick={() => appWindow.minimize()}
      >
        <Icon width={'16'} height={'16'} name="minus" />
      </div>
      <div
        class={styles['titlebar__button']}
        onClick={async () => {
          const isMaximized = await appWindow.isMaximized()

          if (isMaximized) {
            appWindow.unmaximize()
          } else {
            appWindow.maximize()
          }
        }}
      >
        <Icon width={'16'} height={'16'} name="maximize-2" />
      </div>
      <div
        class={styles['titlebar__button']}
        classList={{ [styles['titlebar__button--close']]: true }}
        onClick={() => appWindow.close()}
      >
        <Icon width={'16'} height={'16'} name="x" />
      </div>
    </div>
  )
}
