import { Container } from "ooni-components"

import RunLinkList from "components/List"
import OONIRunHero from "components/OONIRunHero"
import { Box, Heading } from "ooni-components"
import styled from "styled-components"

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
