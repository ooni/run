import { useMemo } from "react"
import * as FAIcons from "react-icons/fa6"
import * as MDIcons from "react-icons/md"

const useIcon = (icon: string | undefined) => {
  return useMemo(() => {
    if (!icon) return ""
    const icons = { ...FAIcons, ...MDIcons }
    if (icons[icon as keyof typeof icons]) {
      const Icon = icons[icon as keyof typeof icons]
      return <Icon style={{ marginRight: "10px" }} />
    }
  }, [icon])
}

export default useIcon
