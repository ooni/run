import SpinLoader from "components/vendor/SpinLoader"
import { Button, Flex, Modal } from "ooni-components"
import { Suspense, lazy, useState } from "react"
import { UseFormSetValue } from "react-hook-form"
import { MdAdd, MdRefresh } from "react-icons/md"
import { TestList } from "./TestListForm"

const IModal = lazy(() => import("./Modal"))

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
          <Suspense
            fallback={
              <Flex height="500px" justifyItems="center" alignItems="center">
                <SpinLoader />
              </Flex>
            }
          >
            <IModal setShow={setShowIconModal} setValue={setValue} />
          </Suspense>
        )}
      </Modal>
    </>
  )
}

export default IconModal
