require("babel-register")()

const useragent = require('useragent')
const next = require('next')
const express = require('express')
const path = require('path')
const { getIntentURI } = require('./utils/links')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = parseInt(process.env.PORT) || 3000

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
  const server = express()

  const staticDir = path.resolve(__dirname, 'static')
  server.use('/static', express.static(staticDir))

  server.get('/apple-app-site-association', (req, res) => {
    res.type('application/json')
    return res.sendFile(path.join(__dirname, 'static', 'apple-app-site-association'))
  })

  server.get('/nettest', (req, res) => {
    let ua = useragent.parse(req.headers['user-agent'])
    if (ua.family === 'Chrome Mobile' && Number(ua.major) >= 25) {
      return res.redirect(getIntentURI(req.query))
    }
    return handle(req, res)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(process.env.PORT, err => {
    if (err) {
      throw err
    }
    console.log('> Ready on http://localhost:' +
                process.env.PORT +
                ' [' + process.env.NODE_ENV + ']')
  })
})
