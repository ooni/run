import mobileApp from '../config/mobileApp'
import { ParsedUrlQuery } from 'querystring'

export const baseURL = 'https://run.ooni.io'

export const minimumVersion = '1.2.0'

export interface Query extends ParsedUrlQuery { 
  tn: string
  mv: string
  ta?: string
}

export const getEncodedQuery = (query: ParsedUrlQuery) => {
  const {tn, ta, mv} = query
  let uri = ''
  if (tn !== undefined && !Array.isArray(tn)) {
    uri = 'tn='
    uri += encodeURIComponent(tn)
  }
  if (ta !== undefined && !Array.isArray(ta)) {
    uri += '&ta='
    uri += encodeURIComponent(ta)
  }
  if (mv !== undefined && !Array.isArray(mv)) {
    uri += '&mv='
    uri += encodeURIComponent(mv)
  }
  return uri
}

export const getUniversalLink = (urls: string[]) => {
  const testName = 'web_connectivity'
  const query: Query = {
    tn: testName,
    mv: minimumVersion,
  }
  if (testName == 'web_connectivity' && urls) {
    query.ta = JSON.stringify({
      'urls': urls
    })
  }
  const queryPart = getEncodedQuery(query)
  return `${baseURL}/nettest?${queryPart}`
}

export const getIntentURI = (query: ParsedUrlQuery) => {
  let uri = 'intent://nettest?'
  uri += getEncodedQuery(query)
  uri += '#Intent;'
  uri += 'package='
  uri += mobileApp.googlePlayID
  uri += ';scheme=ooni;end;S.browser_fallback_url='
  uri += mobileApp.googlePlayLink
  return uri
}