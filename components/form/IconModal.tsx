import SpinLoader from 'components/vendor/SpinLoader'
import dynamic from 'next/dynamic'
import { Modal } from 'ooni-components'
import { useState } from 'react'
import type { UseFormSetValue } from 'react-hook-form'
import { MdAdd, MdRefresh } from 'react-icons/md'
import { useIntl } from 'react-intl'
import type { TestList } from './TestListForm'

const IModal = dynamic(() => import('../form/Modal'), {
  loading: () => (
    <div className="flex h-[500px] justify-center items-center">
      <SpinLoader />
    </div>
  ),
  ssr: false,
})

type IconModal = {
  setValue: UseFormSetValue<TestList>
  iconValue?: string | undefined | null
}

const IconModal = ({ setValue, iconValue }: IconModal) => {
  const intl = useIntl()
  const [showIconModal, setShowIconModal] = useState(false)

  return (
    <>
      {iconValue ? (
        <button
          type="button"
          className="appearance-none text-blue-500 hover:text-blue-800"
          onClick={() => setShowIconModal(true)}
        >
          <span className="flex gap-1 items-center">
            {intl.formatMessage({ id: 'TestListForm.Icon.Replace' })}{' '}
            <MdRefresh />
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => setShowIconModal(true)}
        >
          <span className="flex gap-1 items-center">
            {intl.formatMessage({ id: 'TestListForm.Icon.Select' })} <MdAdd />
          </span>
        </button>
      )}
      <Modal
        show={showIconModal}
        className="max-w-[1000px] w-3/4"
        onHideClick={(e: Event) => {
          e.preventDefault()
          setShowIconModal(false)
        }}
      >
        {showIconModal && ( // extra condition so that icons are lazy loaded only when modal opens
          <IModal setShow={setShowIconModal} setValue={setValue} />
        )}
      </Modal>
    </>
  )
}

export default IconModal
