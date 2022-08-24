import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Hero,
  HeroLead,
  LogoOONIRun,
  Link
} from 'ooni-components'

import styled from 'styled-components'

const BrandContainer = styled.div`
  max-width: 100%;
  height: 95px;
  margin-top: 20px;

  svg {
    max-width: 100%;
  }
`

export default props => {
  return (
    <Hero pb={4} pt={4} sx={{maxWidth: '100% !important'}}>
      <BrandContainer>
        <Link href={props.href}>
          <LogoOONIRun />
        </Link>
      </BrandContainer>
      <HeroLead>
      <FormattedMessage
        id='Hero.SubTitle'
        defaultMessage="Let's fight internet censorship together!"
      />
    </HeroLead>
    </Hero>
  )
}
