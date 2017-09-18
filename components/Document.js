import React from 'react'

import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import meta from '../config/meta'
import mobileApp from '../config/mobileApp'

const Document = props => {
  const sheet = new ServerStyleSheet()
  const main = sheet.collectStyles(props.main)
  /* XXX
   * This is a hack to workaround what I believe is a bug with
   * styled-components SSR
   * If you comment out this line I get back an empty stylesheet
   * */
  renderToString(main)
  const styleTags = sheet.getStyleElement()
  return (
    <html>
    <head>
      <title>{props.title || meta.defaultTitle}</title>
      <meta http-equiv='Content-Type' content={meta.contentType} />
      <meta name='viewport' content={meta.viewport} />
      <meta name='twitter:card' content='app' />
      <meta name='twitter:site' content='@OpenObservatory' />

      {/* Open Graph meta tags. Shared by Twitter and Facebook */}
      <meta name='og:type' content='website' />
      {props.ogTitle && <meta name='og:title' content={props.ogTitle} />}
      {props.universalLink && <meta name='og:url' content={props.universalLink} />}
      {props.ogDescription && <meta name='og:description' content={props.ogDescription} />}

      {/* This is Twitter specific stuff
       * See: https://dev.twitter.com/cards/types/app */}
      {props.deepLink && <meta name='twitter:app:url:iphone' content={props.deepLink} />}
      {props.deepLink && <meta name='twitter:app:url:ipad' content={props.deepLink} />}
      {props.universalLink && <meta name='twitter:app:url:googleplay' content={props.universalLink} />}

      <meta name='twitter:app:name:iphone' content={mobileApp.iPhoneName} />
      <meta name='twitter:app:id:iphone' content={mobileApp.iPhoneID} />
      <meta name='twitter:app:name:ipad' content={mobileApp.iPadName} />
      <meta name='twitter:app:id:ipad' content={mobileApp.iPadID} />
      <meta name='twitter:app:name:googleplay' content={mobileApp.googlePlayName} />
      <meta name='twitter:app:id:googleplay' content={mobileApp.googlePlayID} />

      {/* This is Facebook specific stuff
       * See:
       * * https://developers.facebook.com/docs/applinks/add-to-content/
       * * https://blog.branch.io/how-to-deep-link-on-facebook/ */}

      <meta property='al:android:package' content={mobileApp.googlePlayID} />
      <meta property='al:android:app_name' content={mobileApp.googlePlayName} />
      {props.deepLink && <meta property='al:android:url' content={props.deepLink} />}

      <meta property='al:ios:app_store_id' content={mobileApp.iPhoneID} />
      <meta property='al:ios:app_name' content={mobileApp.iPhoneName} />
      {props.deepLink && <meta property='al:ios:url' content={props.deepLink} />}

      {styleTags}
    </head>
    <body>
      {main}
    </body>
    </html>
  )
}
export default Document
