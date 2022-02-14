// This is a port of the custom server's request handler
// for `/nettest`

import useragent from 'useragent'
import { getIntentURI } from '../../utils/links'

export default function handler(req, res) {
  let ua = useragent.parse(req.headers['user-agent'])
  if (ua.family === 'Chrome Mobile' && Number(ua.major) >= 25) {
    return res.redirect(getIntentURI(req.query))
  }
  return handle(req, res)
}
