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
  runLinks: Descriptor[]
}

const List = ({ runLinks }: ListProps) => {
  return (
    <StyledGrid>
      {runLinks?.map((desc) => (
        <DescriptorCard descriptor={desc} key={desc.oonirun_link_id} />
      ))}
    </StyledGrid>
  )
}

export default List
