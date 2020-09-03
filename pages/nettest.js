import React from 'react'

import Head from 'next/head'

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

import mobileApp from '../config/mobileApp'

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
  return 'OONI Run | Let\'s fight internet censorship together!'
}

const getDescription = (query) => {
  return 'Run OONI Probe'
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
      storeLink = mobileApp.appStoreLink
    } else {
      storeLink = mobileApp.googlePlayLink
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
      userAgent,
      universalLink,
      title,
      description
    }
  }

  render() {
    const {
      userAgent,
      deepLink,
      withWindowLocation,
      storeLink,
      installLink,
      universalLink,
      title,
      description
    } = this.props

    const windowScript = `window.onload = function() {
      document.getElementById('l').src = '${deepLink}';
      setTimeout(function() {
        window.location = '${storeLink}';
      }, 500)
    }`

    return (
      <Layout title={title}>
        <Head>
          <meta name='twitter:card' content='app' />
          <meta name='twitter:site' content='@OpenObservatory' />

          {/* Open Graph meta tags. Shared by Twitter and Facebook */}
          <meta name='og:type' content='website' />
          {universalLink && <meta name='og:url' content={universalLink} />}
          {title && <meta name='og:title' content={title} />}
          <meta name='og:image' content='https://run.ooni.io/static/images/Run-VerticalColorW400px.png' />
          {description && <meta name='og:description' content={description} />}

          {/* This is Twitter specific stuff
            * See: https://dev.twitter.com/cards/types/app */}
          {deepLink && <meta name='twitter:app:url:iphone' content={deepLink} />}
          {deepLink && <meta name='twitter:app:url:ipad' content={deepLink} />}
          {universalLink && <meta name='twitter:app:url:googleplay' content={universalLink} />}

          <meta name='twitter:image' content='https://run.ooni.io/static/images/Run-VerticalColorW400px.png' />
          <meta name='twitter:app:name:iphone' content={mobileApp.iPhoneName} />
          <meta name='twitter:app:id:iphone' content={mobileApp.iPhoneID} />
          <meta name='twitter:app:name:ipad' content={mobileApp.iPadName} />
          <meta name='twitter:app:id:ipad' content={mobileApp.iPadID} />
          <meta name='twitter:app:name:googleplay' content={mobileApp.googlePlayName} />
          <meta name='twitter:app:id:googleplay' content={mobileApp.googlePlayID} />

          {/* This is Facebook specific stuff
            * See:
            * * https://developers.facebook.com/docs/applinks/add-to-content/
            * * https://blog.branch.io/how-to-deep-link-on-facebook/ */}
          <meta property='al:android:package' content={mobileApp.googlePlayID} />
          <meta property='al:android:app_name' content={mobileApp.googlePlayName} />
          {deepLink && <meta property='al:android:url' content={deepLink} />}

          <meta property='al:ios:app_store_id' content={mobileApp.iPhoneID} />
          <meta property='al:ios:app_name' content={mobileApp.iPhoneName} />
          {deepLink && <meta property='al:ios:url' content={deepLink} />}
        </Head>
        <OONIRunHero href={'https://run.ooni.io'} />
        <Container p={4}>
      
       <Heading pt={2} h={2}>You already have the OONI Probe mobile app</Heading>
          <Text pt={2} pb={3}>
            Tap Run and open this link with your OONI Probe mobile app to start the test.
        </Text>
      
      <Link href={deepLink}>
            <Button>
            Run
            </Button>
          </Link>

          <Heading pt={4} h={2}>Install the OONI Probe mobile app</Heading>
          <Text pt={2} pb={3}>
            Currently, OONI Run links only work with the OONI Probe mobile app. 
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
        {withWindowLocation && <iframe id='l' width='1' height='1' style={{visibility: 'hidden'}}></iframe>}
      </Layout>
    )
  }
}
