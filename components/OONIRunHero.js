import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Hero,
  HeroLead,
  LogoOONIRun,
  Link
} from 'ooni-components'

import styled from 'styled-components'
import LocaleSwitcher from './LocaleSwitcher'
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`
const OONIRunHero = (props) => (
  <Hero pb={4} pt={4} sx={{width: '100%', maxWidth: 'none !important'}}>
    <LocaleSwitcher />
    <BrandContainer>
      <Link href={props.href}>
        <LogoOONIRun />
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
