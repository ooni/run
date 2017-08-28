import React from 'react'

import useragent from 'useragent'
import Nettest from '../components/Nettest'
import Invalid from '../components/Invalid'
import Document from '../components/Document'
import { androidPackage, appStoreLink, playStoreLink } from '../settings'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'

const getEncodedQuery = (req) => {
  const {tn,ta,mv} = req.query
  let uri = 'tn='
  uri += encodeURIComponent(tn)
  if (ta !== undefined) {
    uri += '&ta='
    uri += encodeURIComponent(ta)
  }
  uri += '&mv='
  uri += encodeURIComponent(mv)
  return uri
}

const getCustomURI = (req) => {
  let uri = 'ooni://nettest?'
  uri += getEncodedQuery(req)
  return uri
}

const getIntentURI = (req) => {
  let uri = 'intent://nettest?'
  uri += getEncodedQuery(req)
  uri += '#Intent;'
  uri += 'package='
  uri += androidPackage
  uri += ';scheme=ooni;end;S.browser_fallback_url='
  uri += playStoreLink
  return uri
}

const handleUniversalLink = (req, res) => {
  const html = renderToString(<Document main={<Nettest />} />)
  res.send(html)
}

const handleWindowLocation = (req, res, storeLink) => {
  const deepLink = getCustomURI(req)
  const html = renderToString(<Document main={<Nettest withWindowLocation deepLink={deepLink} storeLink={storeLink}/>} />)
  res.send(html)
}

const handleLocationIntent = (req, res) => {
  const deepLink = getCustomURI(req)
  res.redirect(getIntentURI(req))
}

const handleDefault = (req, res) => {
  const html = renderToString(<Document main={<Nettest />} />)
  res.send(html)
}

const nettestHandler = (req, res) => {
  const {tn, mv, ta} = req.query
  if (tn === undefined) {
    res.end(renderToString(<Document main={<Invalid reason="missing tn"/>} />))
    return
  }
  if (mv === undefined) {
    res.end(renderToString(<Document main={<Invalid reason="missing mv"/>} />))
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
