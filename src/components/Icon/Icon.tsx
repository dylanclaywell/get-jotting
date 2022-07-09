import ChevronRight from './ChevronRight'
import ChevronsDown from './ChevronsDown'
import ChevronsUp from './ChevronsUp'
import Plus from './Plus'
import PlusCircle from './PlusCircle'
import Type from './Type'
import FilePlus from './FilePlus'
import FolderPlus from './FolderPlus'
import FileText from './FileText'
import Minus from './Minus'
import Maximize2 from './Maximize2'
import Minimize2 from './Minimize2'
import X from './X'

import styles from './Icon.module.css'

type IconName =
  | 'chevron-right'
  | 'chevrons-down'
  | 'chevrons-up'
  | 'plus-circle'
  | 'plus'
  | 'type'
  | 'folder-plus'
  | 'file-plus'
  | 'file-text'
  | 'minus'
  | 'maximize-2'
  | 'minimize-2'
  | 'x'

export interface Props {
  name: IconName
  className?: string
  width?: string
  height?: string
}

const defaultWidth = '24'
const defaultHeight = '24'

function getIcon(
  name: IconName,
  width: string | undefined,
  height: string | undefined
) {
  const props = {
    width: width ?? defaultWidth,
    height: height ?? defaultHeight,
  }

  switch (name) {
    case 'chevron-right':
      return <ChevronRight {...props} />
    case 'plus-circle':
      return <PlusCircle {...props} />
    case 'plus':
      return <Plus {...props} />
    case 'type':
      return <Type {...props} />
    case 'chevrons-up':
      return <ChevronsUp {...props} />
    case 'chevrons-down':
      return <ChevronsDown {...props} />
    case 'folder-plus':
      return <FolderPlus {...props} />
    case 'file-plus':
      return <FilePlus {...props} />
    case 'file-text':
      return <FileText {...props} />
    case 'minus':
      return <Minus {...props} />
    case 'maximize-2':
      return <Maximize2 {...props} />
    case 'minimize-2':
      return <Minimize2 {...props} />
    case 'x':
      return <X {...props} />
  }
}

export default function Icon(props: Props) {
  return (
    <div class={[styles.icon, props.className].join(' ')}>
      {getIcon(props.name, props.width, props.height)}
    </div>
  )
}
