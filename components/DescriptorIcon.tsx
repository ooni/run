type DescriptorIconProps = {
  icon: string
}

const DescriptorIcon = ({ icon }: DescriptorIconProps) => {
  if (!icon) return ""

  const iconGroup = {
    md: require("react-icons/md"),
    fa: require("react-icons/fa"),
  }

  const selectedIconGroup = icon.slice(0, 2).toLowerCase()

  if (selectedIconGroup !== "fa" && selectedIconGroup !== "md") return ""

  const IconComponent = iconGroup[selectedIconGroup][icon]
  return <IconComponent style={{ marginRight: "10px" }} />
}

export default DescriptorIcon
