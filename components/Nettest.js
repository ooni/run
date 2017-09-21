import React from 'react'
import Layout from './Layout'

import {
  Container,
  Button,
  Link,
  Heading,
  Text,
  Flex
} from 'ooni-components'

import OONIRunHero from './OONIRunHero'

const Nettest = props => {
  const { deepLink, withWindowLocation, storeLink, installLink } = props

  const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${deepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`
  const center = false

  return (
    <Layout>
      <OONIRunHero />
      <Container p={4}>
        <Text pt={2} center={center}>Through this link you are able to run specific OONI Probe tests in the mobile app.</Text>

        <Heading pt={4} pb={3} center={center}>You have the app</Heading>
        <Text pt={2} pb={3} center={center}>If you have the OONI Probe app installed click Run below to start the test.</Text>

          <Link href={deepLink}>
            <Button>Run</Button>
          </Link>

        <Heading pb={3} pt={4} center={center}>Get the app</Heading>
        <Text pt={2} pb={3} center={center}>
          If you are on a desktop computer, click on install below to learn how you can install OONI Probe.
        </Text>

      {/* <Flex justify='center' align='center'> */}
          <Link href={installLink}>
            <Button>
            Install
            </Button>
          </Link>
      </Container>
      {withWindowLocation && <script type='text/javascript' dangerouslySetInnerHTML={{__html: windowScript}} />}
      {withWindowLocation && <iframe id='l' width='1' height='1' style='visibility:hidden'></iframe>}
    </Layout>
  )
}

export default Nettest
