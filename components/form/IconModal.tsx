import SpinLoader from "components/vendor/SpinLoader"
import dynamic from "next/dynamic"
import { Button, Flex, Modal } from "ooni-components"
import { useState } from "react"
import type { UseFormSetValue } from "react-hook-form"
import { MdAdd, MdRefresh } from "react-icons/md"
import type { TestList } from "./TestListForm"

const IModal = dynamic(() => import("../form/Modal"), {
  loading: () => (
    <Flex height="500px" justifyItems="center" alignItems="center">
      <SpinLoader />
    </Flex>
  ),
  ssr: false,
})

type IconModal = {
  setValue: UseFormSetValue<TestList>
  iconValue?: string | undefined | null
}

const IconModal = ({ setValue, iconValue }: IconModal) => {
  const [showIconModal, setShowIconModal] = useState(false)

  return (
    <>
      {iconValue ? (
        <Button
          size="small"
          variant="link"
          endIcon={<MdRefresh />}
          onClick={() => setShowIconModal(true)}
        >
          Replace icon
        </Button>
      ) : (
        <Button
          size="small"
          endIcon={<MdAdd />}
          onClick={() => setShowIconModal(true)}
        >
          Select icon
        </Button>
      )}
      <Modal
        show={showIconModal}
        py={4}
        width={1000}
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
