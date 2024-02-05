import { Box } from "ooni-components"
import { styled } from "styled-components"
import DescriptorCard from "./DescriptorCard"

const StyledGrid = styled(Box)`
display: grid;
grid-template-columns: 1fr;
grid-auto-rows: 1fr;
gap: 16px 24px;
@media (min-width: 800px) {
  grid-template-columns: 1fr 1fr;
}
`

type ListProps = {
  descriptors: Descriptor[]
}
const List = ({ descriptors }: ListProps) => {
  return (
    <StyledGrid>
      {descriptors?.map((desc) => (
        <DescriptorCard descriptor={desc} key={desc.ooni_run_link_id} />
      ))}
    </StyledGrid>
  )
}

export default List
