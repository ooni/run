import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Hero, HeroLead, LogoOONIRun, Link, Box } from 'ooni-components'

import styled from 'styled-components'
import LocaleSwitcher from './LocaleSwitcher'
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`
const OONIRunHero = (props) => (
  <Hero pb={4} pt={2} sx={{width: '100%', maxWidth: 'none !important'}}>
    <LocaleSwitcher />
    <BrandContainer>
      <Link href={props.href}>
        <Box display='inline-block'>
        <LogoOONIRun />
        </Box>
      </Link>
    </BrandContainer>
    <HeroLead>
      <FormattedMessage
        id='Hero.SubTitle'
        defaultMessage="Coordinate website censorship testing"
      />
    </HeroLead>
  </Hero>
)

export default OONIRunHero
