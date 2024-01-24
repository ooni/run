import { Flex } from "ooni-components"
import { UseFormSetValue } from "react-hook-form"
import { styled } from "styled-components"
import { icons } from "utils/icons"
import { TestList } from "./TestListForm"

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
  return (
    <ListContainer>
      {Object.entries(icons).map(([name, icon]) => {
        const IconComponent = icon as React.ElementType
        return (
          <ItemContainer>
            <StyledIconButton
              type="button"
              key={name}
              id={name}
              onClick={() => {
                setValue("ooniRunLink.0.icon", name, {
                  shouldValidate: false,
                })
                setShow(false)
              }}
            >
              <IconComponent size="40" />
              <div style={{ overflow: "hidden" }}>{name}</div>
            </StyledIconButton>
          </ItemContainer>
        )
      })}
    </ListContainer>
  )
}

export default IModal
