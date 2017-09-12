export const baseURL = 'https://run.ooni.io'

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

export const getUniversalLink = (testName, urls) => {
  let query = {
    tn: testName,
    mv: '1.1.6'
  }
  if (testName == 'web_connectivity' && urls) {
    query['ta'] = JSON.stringify({
      'urls': urls
    })
  }
  const queryPart = getEncodedQuery(query)
  return `${baseURL}/nettest?${queryPart}`
}
