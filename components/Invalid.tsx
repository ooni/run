import React from 'react'
import Layout from './Layout'

import { Container, Heading, Text } from 'rebass'

type Props = {
  reason: string
}

const Invalid = ({ reason }: Props) => (
  <Layout>
    <Container>
      <Heading>Invalid request</Heading>
      <Text>The request is invalid: {reason || ''}</Text>
    </Container>
  </Layout>
)
export default Invalid
