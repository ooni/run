import { MdOutlineInventory2 } from 'react-icons/md'
import { useIntl } from 'react-intl'

const ArchivedTag = () => {
  const intl = useIntl()
  return (
    <div className="inline-block">
      <div className="flex uppercase tracking-wide bg-gray-600 text-white text-xs font-bold px-2 py-1 items-center rounded gap-1">
        <span>{intl.formatMessage({ id: 'ArchivedTag.Expired' })}</span>
        <MdOutlineInventory2 />
      </div>
    </div>
  )
}

export default ArchivedTag
