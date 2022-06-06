import ChevronRight from './ChevronRight'
import PlusCircle from './PlusCircle'

type IconName = 'chevron-right' | 'plus-circle'

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
  }
}

export default function Icon({
  name,
  className,
  width,
  height,
}: {
  name: IconName
  className?: string
  width?: string
  height?: string
}) {
  return <div class={className}>{getIcon(name, width, height)}</div>
}
