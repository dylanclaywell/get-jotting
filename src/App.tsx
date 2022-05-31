import type { Component } from 'solid-js'

import styles from './App.module.css'
import Icon from './components/Icon'

const App: Component = () => {
  return (
    <div class={styles['app']}>
      <div class={styles['categories-panel']}>
        <h1 class={styles['app--panel-header']}>Categories</h1>
        <div>
          {['Notes', 'Documentation', 'Something Else'].map((category) => (
            <div class={styles['category']}>
              <span class={styles['category--label']}>{category}</span>
              <Icon className={styles['category--icon']} name="chevron-right" />
            </div>
          ))}
        </div>
      </div>
      <div class={styles['files-panel']}>
        <h1 class={styles['app--panel-header']}>Notes</h1>
      </div>
      <div class={styles['file-panel']}></div>
    </div>
  )
}

export default App
