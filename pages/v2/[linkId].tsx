import OONIRunHero from 'components/OONIRunHero'
import OONIRunHeroMinimal from 'components/OONIRunHeroMinimal'
import CTA from 'components/v2/CTA'
import DescriptorView from 'components/v2/DescriptorView'
import MetaTags from 'components/v2/MetaTags'
import PublicDescriptorView from 'components/v2/PublicDescriptorView'
import mobileApp from 'config/mobileApp'
import { getRunLink } from 'lib/api'
import type { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import { useIntl } from 'react-intl'
import { getIntentURIv2, getUniversalQuery } from 'utils/links'
import OONI404 from '/public/static/images/OONI_404.svg'

const useragent = require('useragent/index.js')

const installLink = 'https://ooni.org/install'

type Props = {
  deepLink: string
  iOSDeepLink: string
  withWindowLocation: boolean
  storeLink: string
  installLink: string
  userAgent: string
  universalLink: string
  title: string
  description: string
  runLink: Descriptor | null
  linkId: string
  error?: unknown
}

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  params,
  query,
}) => {
  const { fallback } = query
  const { linkId } = params as QParams
  const {
    cookies,
    headers: { 'user-agent': userAgent, referer, host },
  } = req

  const refererHost = referer ? new URL(referer).host : null
  const ua = useragent.parse(userAgent)
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  let runLink: Descriptor | null = null
  let error = null
  const deepLink = `ooni://runv2/${linkId}`

  const description = 'Run OONI Probe'
  const title = 'OONI Run | Coordinate website censorship testing'
  const universalLink = `https://${host}/v2/${linkId}`

  try {
    const link = await getRunLink(linkId, {
      baseURL: process.env.NEXT_PUBLIC_OONI_API,
      ...(authToken && {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    })
    if (link) runLink = link
  } catch (e: unknown) {
    if (e instanceof Error) {
      error = e?.message
    }
  }

  const universalQuery = runLink
    ? getUniversalQuery(
        runLink?.nettests
          ?.filter((n) => n.test_name === 'web_connectivity')
          .flatMap((n) => n.inputs),
      )
    : null

  const iOSDeepLink = `ooni://${universalQuery}`

  const storeLink =
    ua.os.family === 'iOS' ? mobileApp.appStoreLink : mobileApp.googlePlayLink

  let withWindowLocation = false

  if (runLink && !fallback && host !== refererHost && !runLink?.is_expired) {
    if (ua.os.family === 'Android') {
      if (Number(ua.major) >= 25) {
        // This is the preferred method for Chrome mobile >= 25
        return {
          redirect: {
            destination: getIntentURIv2(linkId),
            permanent: false,
          },
        }
      }
      withWindowLocation = true
    } else if (ua.os.family === 'iOS' && Number(ua.os.major) >= 9) {
      // Nothing special is needed as the universal link should just work
    } else if (ua.os.family === 'iOS' && Number(ua.os.major) < 9) {
      withWindowLocation = true
    }
  }

  const props: Props = {
    deepLink,
    iOSDeepLink,
    withWindowLocation,
    storeLink,
    installLink,
    userAgent: JSON.stringify(ua),
    universalLink,
    title,
    description,
    linkId,
    runLink,
    error,
  }

  return { props }
}

const Nettest = ({
  userAgent,
  deepLink,
  iOSDeepLink,
  withWindowLocation,
  storeLink,
  installLink,
  universalLink,
  title,
  description,
  runLink,
  linkId,
  error,
}: Props) => {
  const intl = useIntl()
  const isIOS =
    typeof window !== 'undefined' // TODO: remove after iOS testing
      ? JSON.parse(userAgent)?.os?.family === 'iOS' && // TODO: remove after iOS testing
        window.location.hostname !== 'run.test.ooni.org' // TODO: remove after iOS testing
      : JSON.parse(userAgent)?.os?.family === 'iOS'
  const displayDeepLink = isIOS ? iOSDeepLink : deepLink
  console.log('isIOS', isIOS)
  const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${displayDeepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`

  const isMine = !!runLink?.is_mine

  return (
    <>
      {isMine ? <OONIRunHero /> : <OONIRunHeroMinimal />}
      {runLink ? (
        <>
          <MetaTags
            title={title}
            description={description}
            mobileApp={mobileApp}
            deepLink={deepLink}
            iOSDeepLink={displayDeepLink}
            universalLink={universalLink}
          />
          {isMine ? (
            <div className="container px-4 lg:px-8 py-8">
              <DescriptorView
                descriptor={runLink}
                deepLink={displayDeepLink}
                runLink={universalLink}
                linkId={linkId}
                userAgent={userAgent}
              />
            </div>
          ) : (
            <div className="bg-gray-50">
              <div className="container px-4 lg:px-8 py-8">
                <CTA
                  linkTitle={runLink?.name}
                  deepLink={displayDeepLink}
                  // installLink={installLink}
                />
                <div className="mt-8">
                  <PublicDescriptorView
                    descriptor={runLink}
                    deepLink={displayDeepLink}
                    runLink={universalLink}
                    linkId={linkId}
                    userAgent={userAgent}
                  />
                </div>
              </div>
            </div>
          )}
          <>
            {withWindowLocation && (
              <>
                <script
                  type="text/javascript"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: windowScript }}
                />
                <iframe
                  title="OONIProbe"
                  id="l"
                  width="1"
                  height="1"
                  style={{ visibility: 'hidden' }}
                />
              </>
            )}
          </>
        </>
      ) : (
        <div className="container my-16">
          <div className="flex justify-center items-center">
            <div>
              <OONI404 height="200px" />
            </div>
            <div className="pl-16">
              <h4>
                {intl.formatMessage({ id: 'LinkView.Error.DoesNotExist' })}
              </h4>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="container my-16">
          <div className="flex justify-center items-center">
            <div>
              <OONI404 height="200px" />
            </div>
            <div className="pl-16">
              <h4>
                {intl.formatMessage({ id: 'LinkView.Error.ServerError' })}
              </h4>
              <p>{JSON.stringify(error)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nettest
