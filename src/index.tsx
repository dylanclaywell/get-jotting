/* @refresh reload */
import { render } from 'solid-js/web'

import './index.css'
import App from './App'
import TitleBar from './components/TitleBar'

render(() => <TitleBar />, document.getElementById('titlebar') as HTMLElement)
render(() => <App />, document.getElementById('root') as HTMLElement)
