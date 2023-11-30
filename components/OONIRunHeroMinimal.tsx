import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LogoOONIRun, Box } from 'ooni-components'
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

const OONIRunHeroMinimal = () => (
  <Box bg="base" color="white" fontSize={1} p={3}>
    <BrandContainer>
      <NLink href='/'>
        <LogoOONIRun height="24px" />
      </NLink>
    </BrandContainer>
    <Box mt={2}>
      <FormattedMessage
        id="Hero.SubTitle"
        defaultMessage="Coordinate website censorship testing"
      />
    </Box>
  </Box>
)

export default OONIRunHeroMinimal
