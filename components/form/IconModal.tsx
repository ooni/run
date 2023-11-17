import { Modal, Button } from 'ooni-components'
import { useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import * as FAIcons from 'react-icons/fa6'
import * as MDIcons from 'react-icons/md'
import { styled } from 'styled-components'
import { TestList } from './TestListForm'
import { Box } from 'ooni-components'

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
  background: none;
  border: none;
  &:hover {
    cursor: pointer;
    color: gray;
  }
`
type IconModal = {
  setValue: UseFormSetValue<TestList>
  iconValue?: string | undefined | null
}

const IconModal = ({ setValue, iconValue }: IconModal) => {
  const [showIconModal, setShowIconModal] = useState(false)

  return (
    <>
      {iconValue ? 
        <Button size='small' variant='link' endIcon={<MDIcons.MdRefresh />} onClick={() => setShowIconModal(true)}>
          Replace icon
        </Button> : 
        <Button size='small' endIcon={<MDIcons.MdAdd />} onClick={() => setShowIconModal(true)}>
          Select icon
        </Button>
      }
      <Modal
        show={showIconModal}
        py={4}
        px={3}
        width={1000}
        onHideClick={(e: Event) => {
          e.preventDefault()
          setShowIconModal(false)
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: ['1fr 1fr 1fr 1fr', '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'],
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
        </Box>
      </Modal>
    </>
  )
}

export default IconModal
