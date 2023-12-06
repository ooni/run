import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import * as FAIcons from 'react-icons/fa6'
import * as MDIcons from 'react-icons/md'
import { styled } from 'styled-components'
import { TestList } from './TestListForm'
import { Box } from 'ooni-components'

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
type IModal = {
  setValue: UseFormSetValue<TestList>
  setShow: (value: boolean) => void
}

const IModal = ({ setShow, setValue }: IModal) => {
  const [icons, setIcons] = useState({})
    
  useEffect(() => {
    setIcons(
      [...Object.entries(FAIcons), ...Object.entries(MDIcons)].reduce(
        (previous, current) => {
          const [name, icon] = current
          return { ...previous, ...{ [name]: icon } }
        },
        {}
      )
    )
  }, [])

  return (
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
              setShow(false)
            }}
          >
            <IconComponent size="40" />
            <div style={{ overflow: 'hidden' }}>{name}</div>
          </StyledIconButton>
        )
      })}
    </Box>
  )
}

export default IModal
