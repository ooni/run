import React from 'react'
import { FormattedMessage } from 'react-intl'
import { HeroLead, LogoOONIRun, Box, Flex } from 'ooni-components'
import NLink from 'next/link'

import styled from 'styled-components'
import NavBar from 'components/NavBar'
import { Container } from 'ooni-components'
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`

type OONIRunHeroProps = { href: string }
const OONIRunHero = ({ href }: OONIRunHeroProps) => (
  <Box bg="base">
    <Container py='24px'>
      <Flex justifyContent='space-between'>
        <Box color="white" fontSize={1}>
          <BrandContainer>
            <NLink href={href}>
              <LogoOONIRun height="48px" />
            </NLink>
          </BrandContainer>
          <Box mt={2}>
            <FormattedMessage
              id="Hero.SubTitle"
              defaultMessage="Coordinate website censorship testing"
            />
          </Box>
        </Box>
        <NavBar />
      </Flex>
    </Container>
  </Box>
)

export default OONIRunHero
