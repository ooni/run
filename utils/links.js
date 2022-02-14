import mobileApp from '../config/mobileApp'

export const baseURL = process.env.VERCEL_URL || 'https://run.ooni.io'

export const minimumVersion = '1.2.0'

export const getEncodedQuery = ({tn, ta, mv}) => {
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

export const getUniversalLink = (urls) => {
  const testName = 'web_connectivity'
  let query = {
    tn: testName,
    mv: minimumVersion
  }
  if (testName == 'web_connectivity' && urls) {
    query['ta'] = JSON.stringify({
      'urls': urls
    })
  }
  const queryPart = getEncodedQuery(query)
  return `${baseURL}/nettest?${queryPart}`
}

export const getIntentURI = (query) => {
  let uri = 'intent://nettest?'
  uri += getEncodedQuery(query)
  uri += '#Intent;'
  uri += 'package='
  uri += mobileApp.googlePlayID
  uri += ';scheme=ooni;end;S.browser_fallback_url='
  uri += mobileApp.googlePlayLink
  return uri
}
