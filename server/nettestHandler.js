import useragent from 'useragent'

const handleUniversalLink = (req, res) => {
  console.log("Universal Link")
  handleDefault(req, res)
}

const handleWindowLocation = (req, res) => {
  console.log("Window location")
  handleDefault(req, res)
}

const handleLocationIntent = (req, res) => {
  console.log("Location intent")
  handleDefault(req, res)
}

const handleDefault = (req, res) => {
  res.send("hello\n")
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
