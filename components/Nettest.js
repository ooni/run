import React from 'react'
import Layout from './Layout'

import {
  Container,
  Button
} from 'rebass'

const Nettest = props => (
  <Layout>
    <Container>
      <h2>Welcome to the OONI world</h2>
      {props.withWindowLocation && <p>Window location</p>}
    </Container>
  </Layout>
)
export default Nettest
