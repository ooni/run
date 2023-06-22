import React from 'react'
import { FormattedMessage } from 'react-intl'
import { HeroLead, LogoOONIRun, Link, Box } from 'ooni-components'

import styled from 'styled-components'
import NavBar from 'components/NavBar'
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`

type OONIRunHeroProps = { href: string }
const OONIRunHero = ({ href }: OONIRunHeroProps) => (
  <>
    <Box bg="base">
      <NavBar />
    </Box>
    <Box pb={4} bg="base" textAlign="center" color="white" fontSize={2}>
      <BrandContainer>
        <Link href={href}>
          <LogoOONIRun />
        </Link>
      </BrandContainer>
      <HeroLead>
        <FormattedMessage
          id="Hero.SubTitle"
          defaultMessage="Coordinate website censorship testing"
        />
      </HeroLead>
    </Box>
  </>
)

export default OONIRunHero
