interface AppIconProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const AppIcon = ({ name, color = '#7C5CFC', size = 'md' }: AppIconProps) => {
  return (
    <div
      className={`${sizeMap[size]} rounded-lg flex items-center justify-center font-semibold text-white shrink-0`}
      style={{ backgroundColor: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default AppIcon