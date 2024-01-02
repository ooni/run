import Head from 'next/head'
import { Container, Box } from 'ooni-components'

import { getIntentURIv2 } from 'utils/links'

import mobileApp from 'config/mobileApp'
import { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorView from 'components/v2/DescriptorView'
import { getRunLink } from 'lib/api'
import { generateRandomString } from 'utils'
import OONIRunHero from 'components/OONIRunHero'
import OONIRunHeroMinimal from 'components/OONIRunHeroMinimal'
import CTA from 'components/v2/CTA'
import PublicDescriptorView from 'components/v2/PublicDescriptorView'

const useragent = require('useragent/index.js')

const installLink = 'https://ooni.org/install'

type Props = {
  deepLink: string
  runLink: string
  withWindowLocation: boolean
  storeLink: string
  installLink: string
  userAgent: string | undefined
  universalLink: string
  title: string
  description: string
  runLinkDescriptor: {
    descriptor: Descriptor
    mine: boolean
    archived: boolean
    descriptor_creation_time: string
  } | null
  linkId: string
}

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  params,
  query
}) => {
  const { fallback } = query
  const { linkId } = params as QParams
  const { cookies, headers: {'user-agent': userAgent, referer, host}} = req

  const runLink = `${host}/v2/${linkId}`
  const refererHost = referer ? new URL(referer).host : null
  const ua = useragent.parse(userAgent)
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  const deepLink = `ooni://runv2/${linkId}`
  const description = 'Run OONI Probe'
  const title = 'OONI Run | Coordinate website censorship testing'
  const universalLink = `https://run.ooni.io/v2/${linkId}`
  let runLinkDescriptor = null

  try {
    runLinkDescriptor = await getRunLink(
      linkId, 
      { nocache: generateRandomString() },
      {...(authToken && {
        headers: { Authorization: `Bearer ${authToken}` },
      })}
    )
  } catch (e) {}

  let storeLink,
    withWindowLocation = false

  if (ua.os.family == 'iOS') {
    storeLink = mobileApp.appStoreLink
  } else {
    storeLink = mobileApp.googlePlayLink
  }

  if (
    !fallback && 
    (host !== refererHost) && 
    !runLinkDescriptor?.archived
  ) {
    if (ua.os.family == 'Android') {
      if (Number(ua.major) >= 25) {
        // This is the preferred method for Chrome mobile >= 25
        return {
          redirect: {
            destination: getIntentURIv2(linkId),
            permanent: false,
          }
        }
      } else {
        withWindowLocation = true
      }
    } else if (ua.os.family == 'iOS' && Number(ua.os.major) >= 9) {
      // Nothing special is needed as the universal link should just work
    } else if (ua.os.family == 'iOS' && Number(ua.os.major) < 9) {
      withWindowLocation = true
    }
  }

  const props: Props = {
    deepLink,
    runLink,
    withWindowLocation,
    storeLink,
    installLink,
    userAgent,
    universalLink,
    title,
    description,
    linkId,
    runLinkDescriptor
  }

  return { props }
}

const Nettest = ({
  userAgent,
  deepLink,
  runLink,
  withWindowLocation,
  storeLink,
  installLink,
  universalLink,
  title,
  description,
  runLinkDescriptor,
  linkId
}: Props) => {
  const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${deepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`

  const descriptor = runLinkDescriptor?.descriptor
  const descriptorCreationTime = runLinkDescriptor?.descriptor_creation_time || ''
  const archived = !!runLinkDescriptor?.archived
  const isMine = !!runLinkDescriptor?.mine

  return (
    <>
      <Head>
        <meta name="twitter:card" content="app" />
        <meta name="twitter:site" content="@OpenObservatory" />

        {/* Open Graph meta tags. Shared by Twitter and Facebook */}
        <meta name="og:type" content="website" />
        {universalLink && <meta name="og:url" content={universalLink} />}
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
        <meta
          name="twitter:app:id:googleplay"
          content={mobileApp.googlePlayID}
        />

        {/* This is Facebook specific stuff
         * See:
         * * https://developers.facebook.com/docs/applinks/add-to-content/
         * * https://blog.branch.io/how-to-deep-link-on-facebook/ */}
        <meta property="al:android:package" content={mobileApp.googlePlayID} />
        <meta
          property="al:android:app_name"
          content={mobileApp.googlePlayName}
        />
        {deepLink && <meta property="al:android:url" content={deepLink} />}

        <meta property="al:ios:app_store_id" content={mobileApp.iPhoneID} />
        <meta property="al:ios:app_name" content={mobileApp.iPhoneName} />
        {deepLink && <meta property="al:ios:url" content={deepLink} />}
      </Head>

      {descriptor && (
        <>
          {isMine ? (
            <>
              <OONIRunHero />
              <Container p={4}>
                <DescriptorView
                  descriptor={descriptor}
                  descriptorCreationTime={descriptorCreationTime}
                  archived={archived}
                  deepLink={deepLink}
                  runLink={runLink}
                  linkId={linkId}
                />
              </Container>
            </>) : (
              <>
                <OONIRunHeroMinimal />
                <Box bg='gray0'>
                  <Container p={4}>
                    <CTA linkTitle={descriptor?.name} deepLink={deepLink} installLink={installLink} />
                    <Box mt={4}>
                      <PublicDescriptorView
                        descriptor={descriptor}
                        descriptorCreationTime={descriptorCreationTime}
                        archived={archived}
                        deepLink={deepLink}
                        runLink={runLink}
                        linkId={linkId}
                      />
                    </Box>
                    

                    {/* <Box mt={5}>
                      <StyledCode>{userAgent}</StyledCode>
                    </Box> */}
                  </Container>
                </Box>
              </>
            )
          }
          <>
            {withWindowLocation && (
              <>
                <script
                  type="text/javascript"
                  dangerouslySetInnerHTML={{ __html: windowScript }}
                />
                <iframe
                  id="l"
                  width="1"
                  height="1"
                  style={{ visibility: 'hidden' }}
                ></iframe>
              </>
            )}
          </>
        </>
      )}
    </>
  )
}

export default Nettest
