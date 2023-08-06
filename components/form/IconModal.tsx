import { Modal, Button } from 'ooni-components'
import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import * as FAIcons from 'react-icons/fa6'
import * as MDIcons from 'react-icons/md'
import { styled } from 'styled-components'
import { TestList } from './TestListForm'

const icons = [...Object.entries(FAIcons), ...Object.entries(MDIcons)].reduce(
  (previous, current) => {
    const [name, icon] = current
    return { ...previous, ...{ [name]: icon } }
  },
  {}
)

const StyledIconButton = styled.button`
  font-size: 10px;
  min-width: 50px;
`
type IconModal = {
  setValue: UseFormSetValue<TestList>
}

const IconModal = ({ setValue }: IconModal) => {
  const [showIconModal, setShowIconModal] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => setShowIconModal(true)}
      >
        Select icon
      </Button>

      <Modal
        show={showIconModal}
        p={4}
        width={1000}
        onHideClick={(e: Event) => {
          e.preventDefault()
          setShowIconModal(false)
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '4px',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
          }}
        >
          {Object.entries(icons).map(([name, icon], i) => {
            const IconComponent = icon as React.ElementType
            return (
              <StyledIconButton
                type="button"
                key={name}
                id={name}
                onClick={() => {
                  setValue(`ooniRunLink.0.icon`, name, {
                    shouldValidate: false,
                  })
                  setShowIconModal(false)
                }}
              >
                <IconComponent size="40" />
                <div style={{ overflow: 'hidden' }}>{name}</div>
              </StyledIconButton>
            )
          })}
        </div>
      </Modal>
    </>
  )
}

export default IconModal
