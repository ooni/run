import NLink from "next/link"
import { Box, Flex, LogoOONIRun } from "ooni-components"
import { FormattedMessage } from "react-intl"

import NavBar from "components/NavBar"
import { Container } from "ooni-components"
import styled from "styled-components"
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`

const OONIRunHero = () => (
  <Box bg="base">
    <Container py="24px">
      <Flex justifyContent="space-between">
        <Box color="white" fontSize={1}>
          <BrandContainer>
            <NLink href="/">
              <LogoOONIRun height="48px" />
            </NLink>
          </BrandContainer>
          <Box mt={2}>
            <FormattedMessage id="Hero.SubTitle" />
          </Box>
        </Box>
        <NavBar />
      </Flex>
    </Container>
  </Box>
)

export default OONIRunHero
