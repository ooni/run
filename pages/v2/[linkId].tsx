import OONIRunHero from "components/OONIRunHero"
import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
import CTA from "components/v2/CTA"
import DescriptorView from "components/v2/DescriptorView"
import MetaTags from "components/v2/MetaTags"
import PublicDescriptorView from "components/v2/PublicDescriptorView"
import mobileApp from "config/mobileApp"
import { getRunLink } from "lib/api"
import { GetServerSideProps } from "next"
import { Box, Container } from "ooni-components"
import type { ParsedUrlQuery } from "querystring"
import { generateRandomString } from "utils"
import { getIntentURIv2 } from "utils/links"

const useragent = require("useragent/index.js")

const installLink = "https://ooni.org/install"

type Props = {
  deepLink: string
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

  const deepLink = `ooni://runv2/${linkId}`
  const description = "Run OONI Probe"
  const title = "OONI Run | Coordinate website censorship testing"
  const universalLink = `https://${host}/v2/${linkId}`
  let runLinkDescriptor = null

  try {
    runLinkDescriptor = await getRunLink(
      linkId,
      { nocache: generateRandomString() },
      {
        ...(authToken && {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      },
    )
  } catch (e) {}

  let storeLink
  let withWindowLocation = false

  if (ua.os.family === "iOS") {
    storeLink = mobileApp.appStoreLink
  } else {
    storeLink = mobileApp.googlePlayLink
  }

  if (
    runLinkDescriptor &&
    !fallback &&
    host !== refererHost &&
    !runLinkDescriptor?.archived
  ) {
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
    withWindowLocation,
    storeLink,
    installLink,
    userAgent,
    universalLink,
    title,
    description,
    linkId,
    runLinkDescriptor,
  }

  return { props }
}

const Nettest = ({
  userAgent,
  deepLink,
  withWindowLocation,
  storeLink,
  installLink,
  universalLink,
  title,
  description,
  runLinkDescriptor,
  linkId,
}: Props) => {
  const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${deepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`

  const descriptor = runLinkDescriptor?.descriptor
  const descriptorCreationTime =
    runLinkDescriptor?.descriptor_creation_time || ""
  const archived = !!runLinkDescriptor?.archived
  const isMine = !!runLinkDescriptor?.mine

  return (
    <>
      {descriptor && (
        <>
          <MetaTags
            title={title}
            description={description}
            mobileApp={mobileApp}
            deepLink={deepLink}
            universalLink={universalLink}
          />
          {isMine ? (
            <>
              <OONIRunHero />
              <Container px={[3, 3, 4]} py={4}>
                <DescriptorView
                  descriptor={descriptor}
                  descriptorCreationTime={descriptorCreationTime}
                  archived={archived}
                  deepLink={deepLink}
                  runLink={universalLink}
                  linkId={linkId}
                />
              </Container>
            </>
          ) : (
            <>
              <OONIRunHeroMinimal />
              <Box bg="gray0">
                <Container px={[3, 3, 4]} py={4}>
                  <CTA
                    linkTitle={descriptor?.name}
                    deepLink={deepLink}
                    installLink={installLink}
                  />
                  <Box mt={4}>
                    <PublicDescriptorView
                      descriptor={descriptor}
                      descriptorCreationTime={descriptorCreationTime}
                      archived={archived}
                      deepLink={deepLink}
                      runLink={universalLink}
                      linkId={linkId}
                    />
                  </Box>
                </Container>
              </Box>
            </>
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
      )}
    </>
  )
}

export default Nettest
