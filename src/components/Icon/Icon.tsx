import ChevronRight from './ChevronRight'
import Plus from './Plus'
import PlusCircle from './PlusCircle'

type IconName = 'chevron-right' | 'plus-circle' | 'plus'

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
  }
}

export default function Icon(props: Props) {
  return (
    <div class={props.className}>
      {getIcon(props.name, props.width, props.height)}
    </div>
  )
}
