import type { UseFormSetValue } from 'react-hook-form'
import { icons } from 'utils/icons'
import type { TestList } from './TestListForm'

type IModal = {
  setValue: UseFormSetValue<TestList>
  setShow: (value: boolean) => void
}

const IModal = ({ setShow, setValue }: IModal) => {
  return (
    <div className="flex flex-wrap justify-center">
      {Object.entries(icons).map(([name, icon]) => {
        const IconComponent = icon as React.ElementType
        return (
          <div className="p-2 w-1/2 lg:w-1/3 xl:w-[12%] box-border" key={name}>
            <button
              className="text-xs min-w-12 w-full appearance-none cursor-pointer hover:text-gray-600"
              type="button"
              id={name}
              onClick={() => {
                setValue('icon', name, {
                  shouldValidate: false,
                })
                setShow(false)
              }}
            >
              <IconComponent size="40" className="mx-auto" />
              <div style={{ overflow: 'hidden' }}>{name}</div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default IModal
