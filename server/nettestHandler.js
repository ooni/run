import React from 'react'

import useragent from 'useragent'
import Nettest from '../components/Nettest'
import Document from '../components/Document'

import { renderToString, renderToStaticMarkup } from 'react-dom/server'

const handleUniversalLink = (req, res) => {
  //const html = renderToString(<Document main={<Nettest />} />)
  res.send(html)
  handleDefault(req, res)
}

const handleWindowLocation = (req, res) => {
  console.log("Window location")
  //const html = renderToString(<Document main={<Nettest withWindowLocation/>} />)
  res.send(html)
  handleDefault(req, res)
}

const handleLocationIntent = (req, res) => {
  console.log("Location intent")
  handleDefault(req, res)
}

const handleDefault = (req, res) => {
  const html = renderToString(<Document main={<Nettest withWindowLocation/>} />)
  res.send(html)
}

const nettestHandler = (req, res) => {
  let ua = useragent.parse(req.headers['user-agent'])

  if (ua.os.family == 'Android') {
    handleLocationIntent(req, res)
  } else if (ua.os.family == 'iOS' && Number(ua.os.major) >= 9) {
    handleUniversalLink(req, res)
  } else if (ua.os.family == 'iOS' && Number(ua.os.major) < 9) {
    handleWindowLocation(req, res)
  } else {
    handleDefault(req, res)
  }
}
module.exports = nettestHandler
