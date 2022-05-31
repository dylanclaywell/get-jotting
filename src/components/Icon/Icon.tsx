import ChevronRight from './ChevronRight'

type IconName = 'chevron-right'

function getIcon(
  name: IconName,
  width: string | undefined,
  height: string | undefined
) {
  switch (name) {
    case 'chevron-right':
      return <ChevronRight width={width ?? '24'} height={height ?? '24'} />
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
