import type { ParsedUrlQuery } from 'node:querystring'
import mobileApp from '../config/mobileApp'

export const baseURL = 'https://run.ooni.org'

export const minimumVersion = '1.2.0'

export interface Query extends ParsedUrlQuery {
  tn: string
  mv: string
  ta?: string
  runId: string
}

export const getEncodedQuery = (query: ParsedUrlQuery) => {
  const { tn, ta, mv, runId } = query
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
  if (runId !== undefined && !Array.isArray(runId)) {
    uri += '&runId='
    uri += encodeURIComponent(runId)
  }
  return uri
}

export const getUniversalQuery = (urls: string[], runId: string) => {
  const testName = 'web_connectivity'
  const query: Query = {
    tn: testName,
    mv: minimumVersion,
    runId,
  }
  if (testName === 'web_connectivity' && urls) {
    query.ta = JSON.stringify({
      urls: urls,
    })
  }
  const queryPart = getEncodedQuery(query)
  return `nettest?${queryPart}`
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

export const getIntentURIv2 = (linkId: string) => {
  let uri = `intent://runv2/${linkId}`
  uri += '#Intent;'
  uri += `package=${mobileApp.googlePlayID};`
  uri += 'scheme=ooni;'
  uri += 'end;'
  uri += `S.browser_fallback_url=${baseURL}/v2/${linkId}?fallback=true;`
  return uri
}
