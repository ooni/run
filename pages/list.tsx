import { Container } from "ooni-components"

import dynamic from "next/dynamic"
import { Box, Heading } from "ooni-components"
import styled from "styled-components"

const RunLinkList = dynamic(() => import("components/List"))
const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

const StyledBox = styled(Box)`
box-shadow: 0 50vh 0 50vh ${(props) => props.theme.colors.gray1};
`

const List = () => {
  const queryParams = { only_mine: true, include_archived: true }

  return (
    <>
      <OONIRunHero />
      <StyledBox bg="gray1">
        <Container py={4}>
          <Heading h={2} mb={2}>
            My OONI Run Links
          </Heading>
          <RunLinkList queryParams={queryParams} />
        </Container>
      </StyledBox>
    </>
  )
}

export default List
