require("babel-register")()
const express = require('express')
const path = require('path')

const nettestHandler = require('./server/nettestHandler')

process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PORT = process.env.PORT || 3200

const dev = process.env.NODE_ENV !== 'production'
const server = express()

/*server.use('/_/static',
           express.static(__dirname + '/static/'))
*/

server.get('/nettest', nettestHandler)

server.listen(process.env.PORT, err => {
  if (err) {
    throw err
  }
  console.log('> Ready on http://localhost:' +
              process.env.PORT +
              ' [' + process.env.NODE_ENV + ']')
})
