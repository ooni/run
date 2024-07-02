import OONIRunHero from "components/OONIRunHero"
import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
import CTA from "components/v2/CTA"
import DescriptorView from "components/v2/DescriptorView"
import MetaTags from "components/v2/MetaTags"
import PublicDescriptorView from "components/v2/PublicDescriptorView"
import mobileApp from "config/mobileApp"
import { getRunLink } from "lib/api"
import type { GetServerSideProps } from "next"
import type { ParsedUrlQuery } from "node:querystring"
import { Box, Container, Flex } from "ooni-components"
import { getIntentURIv2, getUniversalQuery } from "utils/links"
import OONI404 from "/public/static/images/OONI_404.svg"

const useragent = require("useragent/index.js")

const installLink = "https://ooni.org/install"

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
    headers: { "user-agent": userAgent, referer, host },
  } = req

  const refererHost = referer ? new URL(referer).host : null
  const ua = useragent.parse(userAgent)
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  let runLink: Descriptor | null = null
  let error = null
  const deepLink = `ooni://runv2/${linkId}`

  const description = "Run OONI Probe"
  const title = "OONI Run | Coordinate website censorship testing"
  const universalLink = `https://${host}/v2/${linkId}`

  try {
    runLink = await getRunLink(linkId, {
      baseURL: process.env.NEXT_PUBLIC_OONI_API,
      ...(authToken && {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    })
  } catch (e: unknown) {
    console.log("ERROR", e)
    error = e
  }

  const universalQuery = runLink
    ? getUniversalQuery(
        runLink?.nettests
          ?.filter((n) => n.test_name === "web_connectivity")
          .flatMap((n) => n.inputs),
      )
    : null
  const iOSDeepLink = `ooni://${universalQuery}`

  const storeLink =
    ua.os.family === "iOS" ? mobileApp.appStoreLink : mobileApp.googlePlayLink
  let withWindowLocation = false

  if (runLink && !fallback && host !== refererHost && !runLink?.is_expired) {
    if (ua.os.family === "Android") {
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
    } else if (ua.os.family === "iOS" && Number(ua.os.major) >= 9) {
      // Nothing special is needed as the universal link should just work
    } else if (ua.os.family === "iOS" && Number(ua.os.major) < 9) {
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
  const isIOS = JSON.parse(userAgent).family === "iOS"
  const displayDeepLink = isIOS ? iOSDeepLink : deepLink

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
            iOSDeepLink={iOSDeepLink}
            universalLink={universalLink}
          />
          {isMine ? (
            <Container px={[3, 3, 4]} py={4}>
              <DescriptorView
                descriptor={runLink}
                deepLink={displayDeepLink}
                runLink={universalLink}
                linkId={linkId}
                userAgent={userAgent}
              />
            </Container>
          ) : (
            <Box bg="gray0">
              <Container px={[3, 3, 4]} py={4}>
                <CTA
                  linkTitle={runLink?.name}
                  deepLink={displayDeepLink}
                  installLink={installLink}
                />
                <Box mt={4}>
                  <PublicDescriptorView
                    descriptor={runLink}
                    deepLink={displayDeepLink}
                    runLink={universalLink}
                    linkId={linkId}
                    userAgent={userAgent}
                  />
                </Box>
              </Container>
            </Box>
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
                  style={{ visibility: "hidden" }}
                />
              </>
            )}
          </>
        </>
      ) : (
        <Container my={5}>
          <Flex justifyContent="center" alignItems="center">
            <Box>
              <OONI404 height="200px" />
            </Box>
            <Box pl={5}>Run Link not found</Box>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default Nettest
