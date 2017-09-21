import React from 'react'


import {
  Container,
  Button,
  IconButton,
  Link,
  Heading,
  Text,
  Flex,
  Box,
  Code
} from 'ooni-components'

import { getEncodedQuery } from '../utils/links'

import Layout from '../components/Layout'
import OONIRunHero from '../components/OONIRunHero'

import { androidPackage, appStoreLink, playStoreLink } from '../settings'

const useragent = require('useragent/index.js')

const installLink = 'https://ooni.torproject.org/install'

const getCustomURI = (query) => {
  let uri = 'ooni://nettest?'
  uri += getEncodedQuery(query)
  return uri
}

const getUniversalLink = (query) => {
  let uri = 'https://run.ooni.io/nettest?'
  uri += getEncodedQuery(query)
  return uri
}

const getTitle = (query) => {
  return 'OONI Run'
}

const getDescription = (query) => {
  return 'Run OONI Probe'
}

const getIntentURI = (query) => {
  let uri = 'intent://nettest?'
  uri += getEncodedQuery(query)
  uri += '#Intent;'
  uri += 'package='
  uri += androidPackage
  uri += ';scheme=ooni;end;S.browser_fallback_url='
  uri += playStoreLink
  return uri
}

export default class extends React.Component {
  static async getInitialProps({ req, query }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    const ua = useragent.parse(userAgent)

    const deepLink = getCustomURI(query)
    const description = getDescription(query)
    const title = getTitle(query)
    const universalLink = getUniversalLink(query)

    let storeLink,
      withWindowLocation = false

    if (ua.os.family == 'iOS') {
      storeLink = appStoreLink
    } else {
      storeLink = playStoreLink
    }

    if (ua.os.family == 'Android') {
      // Accordingy to
      // https://developer.chrome.com/multidevice/android/intents
      // this is the preferred method for Chrome mobile >= 25
      if (ua.family === 'Chrome Mobile' && Number(ua.major) >= 25) {
        // This case is handled with a server-side redirect
      } else {
        withWindowLocation = true
      }
    } else if (ua.os.family == 'iOS' && Number(ua.os.major) >= 9) {
      // Nothing special is needed as the universal link should just work
    } else if (ua.os.family == 'iOS' && Number(ua.os.major) < 9) {
      withWindowLocation = true
    }

    return {
      deepLink,
      withWindowLocation,
      storeLink,
      installLink,
      userAgent
    }
  }

  render() {
    const { userAgent, deepLink, withWindowLocation, storeLink, installLink } = this.props
    const windowScript = `window.onload = function() {
      document.getElementById('l').src = '${deepLink}';
      setTimeout(function() {
        window.location = '${storeLink}';
      }, 500)
    }`

    return (
      <Layout>
        <OONIRunHero />
        <Container p={4}>
          <Text pt={2}>Through this link you are able to run specific OONI Probe tests in the mobile app.</Text>

          <Heading pt={4} h={2}>You have the app</Heading>
          <Text pt={2} pb={3}>If you have the OONI Probe app installed click Run below to start the test.</Text>

          <Link href={deepLink}>
            <Button>Run</Button>
          </Link>

          <Heading pt={4} h={2}>Get the app</Heading>
          <Text pt={2} pb={3}>
            If you are on a desktop computer, click on install below to learn how you can install OONI Probe.
          </Text>

          <Link href={installLink}>
            <Button>
            Install
            </Button>
          </Link>

          <Box mt={5}>
          <Code>{userAgent}</Code>
          </Box>
        </Container>
        {withWindowLocation && <script type='text/javascript' dangerouslySetInnerHTML={{__html: windowScript}} />}
        {withWindowLocation && <iframe id='l' width='1' height='1' style='visibility:hidden'></iframe>}
      </Layout>
    )
  }
}
