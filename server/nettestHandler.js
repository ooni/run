import React from 'react'

import useragent from 'useragent'
import Nettest from '../components/Nettest'
import Invalid from '../components/Invalid'
import Document from '../components/Document'
import { androidPackage, appStoreLink, playStoreLink } from '../settings'

import { getEncodedQuery } from '../utils/links'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'

const installLink = 'https://ooni.torproject.org/install'

// XXX
// We should integrate this with piwik:
// https://piwik.org/blog/2014/06/track-api-calls-node-js-piwik/

const getCustomURI = (req) => {
  let uri = 'ooni://nettest?'
  uri += getEncodedQuery(req.query)
  return uri
}

const getUniversalLink = (req) => {
  let uri = 'https://run.ooni.io/nettest?'
  uri += getEncodedQuery(req.query)
  return uri
}

const getTitle = (req) => {
  return 'OONI Run'
}

const getDescription = (req) => {
  return 'Run OONI Probe'
}

const getIntentURI = (req) => {
  let uri = 'intent://nettest?'
  uri += getEncodedQuery(req.query)
  uri += '#Intent;'
  uri += 'package='
  uri += androidPackage
  uri += ';scheme=ooni;end;S.browser_fallback_url='
  uri += playStoreLink
  return uri
}

const handleUniversalLink = (req, res) => {
  const deepLink = getCustomURI(req)
  const description = getDescription(req)
  const title = getTitle(req)
  const universalLink = getUniversalLink(req)

  const html = renderToString(
    <Document
      title={title}
      ogTitle={title}
      ogDescription={title}
      universalLink={universalLink}
      deepLink={deepLink}
      main={<Nettest />}
    />
  )
  res.send(html)
}

const handleWindowLocation = (req, res, storeLink) => {
  const deepLink = getCustomURI(req)
  const description = getDescription(req)
  const title = getTitle(req)
  const universalLink = getUniversalLink(req)

  const html = renderToString(
    <Document
      title={title}
      ogTitle={title}
      ogDescription={title}
      universalLink={universalLink}
      deepLink={deepLink}
      main={
        <Nettest
          withWindowLocation
          deepLink={deepLink}
          installLink={installLink}
          storeLink={storeLink}/>
      } />
  )
  res.send(html)
}

const handleLocationIntent = (req, res) => {
  const deepLink = getCustomURI(req)
  res.redirect(getIntentURI(req))
}

const handleDefault = (req, res) => {
  const deepLink = getCustomURI(req)
  const description = getDescription(req)
  const title = getTitle(req)
  const universalLink = getUniversalLink(req)

  const html = renderToString(
    <Document
      title={title}
      ogTitle={title}
      ogDescription={title}
      universalLink={universalLink}
      deepLink={deepLink}
      main={<Nettest
              installLink={installLink}
              deepLink={deepLink} />} />
  )
  res.send(html)
}

const nettestHandler = (req, res) => {
  const {tn, mv, ta} = req.query
  if (tn === undefined) {
    res.end(
      renderToString(
        <Document
          main={<Invalid reason="missing tn"/>}
        />
      )
    )
    return
  }
  if (mv === undefined) {
    res.end(
      renderToString(
        <Document
          main={<Invalid reason="missing mv"/>} />
      )
    )
    return
  }

  let ua = useragent.parse(req.headers['user-agent'])
  if (ua.os.family == 'Android') {

    // Accordingy to https://developer.chrome.com/multidevice/android/intents
    // this is the preferred method for Chrome mobile >= 25
    if (ua.family === 'Chrome Mobile' && Number(ua.major) >= 25) {
      return handleLocationIntent(req, res)
    }
    return handleWindowLocation(req, res, playStoreLink)
  } else if (ua.os.family == 'iOS' && Number(ua.os.major) >= 9) {
    return handleUniversalLink(req, res)
  } else if (ua.os.family == 'iOS' && Number(ua.os.major) < 9) {
    return handleWindowLocation(req, res, appStoreLink)
  } else {
    return handleDefault(req, res)
  }
}
module.exports = nettestHandler
