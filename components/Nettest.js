import React from 'react'
import Layout from './Layout'

import {
  Container,
  ButtonOutline,
  Heading
} from 'rebass'

const Nettest = props => {
  const { deepLink, withWindowLocation, storeLink } = props

  const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${deepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`

  return (
    <Layout>
      <Container>
        <Heading>Run ooniprobe!</Heading>
        <ButtonOutline>Install on iOS</ButtonOutline>
        <ButtonOutline>Install on Android</ButtonOutline>
      </Container>
      {withWindowLocation && <script type='text/javascript' dangerouslySetInnerHTML={{__html: windowScript}} />}
      {withWindowLocation && <iframe id='l' width='1' height='1' style='visibility:hidden'></iframe>}
    </Layout>
  )
}

export default Nettest
