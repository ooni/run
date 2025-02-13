import mobileApp from '../config/mobileApp'

export const baseURL = 'https://run.ooni.org'

export const getIntentURIv2 = (linkId: string) => {
  let uri = `intent://runv2/${linkId}`
  uri += '#Intent;'
  uri += `package=${mobileApp.googlePlayID};`
  uri += 'scheme=ooni;'
  uri += 'end;'
  uri += `S.browser_fallback_url=${baseURL}/v2/${linkId}?fallback=true;`
  return uri
}
