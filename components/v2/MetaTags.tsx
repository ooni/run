import mobileApp from "config/mobileApp"
import Head from "next/head"

type MetaTagsProps = {
  deepLink: string
  universalLink: string
  title: string
  description: string
  mobileApp: typeof mobileApp
}

const MetaTags = ({
  deepLink,
  universalLink,
  title,
  description,
  mobileApp,
}: MetaTagsProps) => {
  return (
    <Head>
      <meta name="twitter:card" content="app" />
      <meta name="twitter:site" content="@OpenObservatory" />

      {/* Open Graph meta tags. Shared by Twitter and Facebook */}
      <meta name="og:type" content="website" />
      <meta name="og:url" content={universalLink} />
      {title && <meta name="og:title" content={title} />}
      <meta
        name="og:image"
        content="https://run.ooni.io/static/images/Run-VerticalColorW400px.png"
      />
      {description && <meta name="og:description" content={description} />}

      {/* This is Twitter specific stuff
       * See: https://dev.twitter.com/cards/types/app */}
      {deepLink && <meta name="twitter:app:url:iphone" content={deepLink} />}
      {deepLink && <meta name="twitter:app:url:ipad" content={deepLink} />}
      {universalLink && (
        <meta name="twitter:app:url:googleplay" content={universalLink} />
      )}

      <meta
        name="twitter:image"
        content="https://run.ooni.io/static/images/Run-VerticalColorW400px.png"
      />
      <meta name="twitter:app:name:iphone" content={mobileApp.iPhoneName} />
      <meta name="twitter:app:id:iphone" content={mobileApp.iPhoneID} />
      <meta name="twitter:app:name:ipad" content={mobileApp.iPadName} />
      <meta name="twitter:app:id:ipad" content={mobileApp.iPadID} />
      <meta
        name="twitter:app:name:googleplay"
        content={mobileApp.googlePlayName}
      />
      <meta name="twitter:app:id:googleplay" content={mobileApp.googlePlayID} />

      {/* This is Facebook specific stuff
       * See:
       * * https://developers.facebook.com/docs/applinks/add-to-content/
       * * https://blog.branch.io/how-to-deep-link-on-facebook/ */}
      <meta property="al:android:package" content={mobileApp.googlePlayID} />
      <meta property="al:android:app_name" content={mobileApp.googlePlayName} />
      {deepLink && <meta property="al:android:url" content={deepLink} />}

      <meta property="al:ios:app_store_id" content={mobileApp.iPhoneID} />
      <meta property="al:ios:app_name" content={mobileApp.iPhoneName} />
      {deepLink && <meta property="al:ios:url" content={deepLink} />}
    </Head>
  )
}

export default MetaTags
