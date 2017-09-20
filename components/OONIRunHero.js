import React from 'react'

import {
  Hero,
  HeroLead,
  OONISubBrandRun
} from 'ooni-components'

import styled from 'styled-components'
const BrandContainer = styled.div`
  max-width: 100%;
  svg {
    max-width: 100%;
  }
`
export default props => {
  return (
    <Hero pb={4} pt={4}>
      <BrandContainer>
        <OONISubBrandRun />
      </BrandContainer>
      <HeroLead>Let's fight internet censorship together!</HeroLead>
    </Hero>
  )
}
