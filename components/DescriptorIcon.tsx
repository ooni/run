import { icons } from 'utils/icons'

type DescriptorIconProps = {
  icon: keyof typeof icons
}

const DescriptorIcon = ({ icon }: DescriptorIconProps) => {
  if (!icon) return ''

  const IconComponent = icons[icon]

  return IconComponent ? (
    <IconComponent style={{ marginRight: '10px' }} className="inline" />
  ) : (
    ''
  )
}

export default DescriptorIcon
