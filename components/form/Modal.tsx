import { useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import * as FAIcons from 'react-icons/fa6'
import * as MDIcons from 'react-icons/md'
import { styled } from 'styled-components'
import { TestList } from './TestListForm'
import { VirtuosoGrid } from 'react-virtuoso'
import { Flex } from 'ooni-components'

const ItemContainer = styled.div`
  padding: 8px;
  width: 12%;
  box-sizing: border-box;
  @media (max-width: 1024px) {
    width: 30%;
  }
  @media (max-width: 300px) {
    width: 50%;
  }
`

const ItemWrapper = styled.div`
  height: 57px;
`

const ListContainer = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const StyledIconButton = styled.button`
  font-size: 10px;
  min-width: 50px;
  width: 100%;
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
    <>
      {!!Object.entries(icons).length && 
        <VirtuosoGrid
          style={{ height: 500 }}
          totalCount={Object.entries(icons).length}
          overscan={200}
          components={{
            Item: ItemContainer,
            List: ListContainer,
          }}
          itemContent={index => {
            const [name, icon] = Object.entries(icons)[index]
            const IconComponent = icon as React.ElementType

            return (
              <ItemWrapper>
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
              </ItemWrapper>
            )
          }}
        />
      }
    </>
  )
}

export default IModal
