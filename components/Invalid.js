import React from 'react'
import Layout from './Layout'

import {
  Container,
  Heading,
  Text
} from 'rebass'

const Invalid = props => (
  <Layout>
    <Container>
      <Heading>Invalid request</Heading>
      <Text>The request is invalid: {props.reason || ''}</Text>
    </Container>
  </Layout>
)
export default Invalid
