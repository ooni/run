import React from "react"

import Head from "next/head"
import { Box, Button, Container, Heading, Link, Text } from "ooni-components"
import { FormattedMessage } from "react-intl"

import { getEncodedQuery } from "utils/links"

import { FaExclamationTriangle } from "react-icons/fa"

import styled from "styled-components"
import Layout from "../components/Layout"
import OONIRunHero from "../components/OONIRunHero"
import mobileApp from "../config/mobileApp"
const StyledCode = styled.code`
font-family: courier, monospace;
`

const installLink = "https://ooni.org/install"
const getCustomURI = (query) => {
  let uri = "ooni://nettest?"
  uri += getEncodedQuery(query)
  return uri
}
const getUniversalLink = (query) => {
  let uri = "https://run.ooni.io/nettest?"
  uri += getEncodedQuery(query)
  return uri
}

export const getServerSideProps = async ({ req, query }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  const deepLink = getCustomURI(query)
  const description = "Run OONI Probe"
  const title = "OONI Run | Coordinate website censorship testing"
  const universalLink = getUniversalLink(query)
  const props = {
    deepLink,
    installLink,
    userAgent,
    universalLink,
    title,
    description,
  }
  return { props }
}

const Nettest = ({
  userAgent,
  deepLink,
  installLink,
  universalLink,
  title,
  description,
}) => {
  return (
    <Layout title={title}>
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
      <OONIRunHero href={"https://run.ooni.io"} />
      <Container p={4}>
        <Box
          css={{
            border: "2px solid #c92a2a",
            color: "#c92a2a",
            padding: "16px",
            marginBottom: "32px",
            borderRadius: "6px",
            lineHeight: 1.3
          }}
        >
          <p>
            <FaExclamationTriangle />{" "}
            <FormattedMessage
              id="Nettest.DeprecationWarning"
              values={{
                login: (string) => (
                  <a href="https://run.ooni.org/login">{string}</a>
                ),
              }}
            />
          </p>
        </Box>
        <Heading pt={2} h={2}>
          <FormattedMessage
            id="Nettest.Heading.HaveMobileApp"
            defaultMessage="You already have the OONI Probe mobile app"
          />
        </Heading>
        <Text pt={2} pb={3}>
          <FormattedMessage
            id="Nettest.Text.HaveMobileApp"
            defaultMessage="Tap Run and open this link with your OONI Probe mobile app to start the test."
          />
        </Text>
        <Link href={deepLink}>
          <Button>
            <FormattedMessage id="Nettest.Button.Run" defaultMessage="Run" />
          </Button>
        </Link>

        <Heading pt={4} h={2}>
          <FormattedMessage
            id="Nettest.Heading.InstallApp"
            defaultMessage="Install the OONI Probe mobile app"
          />
        </Heading>

        <Text pt={2} pb={3}>
          <FormattedMessage
            id="Nettest.Text.InstallApp"
            defaultMessage="Currently, OONI Run links only work with the OONI Probe mobile app."
          />
        </Text>
        <Link href={installLink}>
          <Button>
            <FormattedMessage id="Nettest.Button.Install" />
          </Button>
        </Link>
        <Box mt={5}>
          <StyledCode>{userAgent}</StyledCode>
        </Box>
      </Container>
    </Layout>
  )
}
export default Nettest
