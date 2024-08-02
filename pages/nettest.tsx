import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
import MetaTags from "components/v2/MetaTags"
import type { GetServerSideProps } from "next"
import type { ParsedUrlQuery } from "node:querystring"
import { Box, Button, Container, Heading, Link, Text } from "ooni-components"
import { FaExclamationTriangle } from "react-icons/fa"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import { getEncodedQuery } from "utils/links"
import mobileApp from "../config/mobileApp"

const StyledCode = styled.code`
  font-family: courier, monospace;
`

const installLink = "https://ooni.org/install"

const getCustomURI = (query: ParsedUrlQuery) => {
  let uri = "ooni://nettest?"
  uri += getEncodedQuery(query)
  return uri
}

const getUniversalLink = (query: ParsedUrlQuery) => {
  let uri = "https://run.ooni.io/nettest?"
  uri += getEncodedQuery(query)
  return uri
}

type Props = {
  deepLink: string
  installLink: string
  userAgent: string | undefined
  universalLink: string
  title: string
  description: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  query,
}) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent

  const deepLink = getCustomURI(query)
  const description = "Run OONI Probe"
  const title = "OONI Run | Coordinate website censorship testing"
  const universalLink = getUniversalLink(query)

  const props: Props = {
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
}: Props) => {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        mobileApp={mobileApp}
        deepLink={deepLink}
        universalLink={universalLink}
      />
      <OONIRunHeroMinimal />
      <Container p={4}>
        <Box
          sx={{
            border: "2px solid",
            borderColor: "red8",
            color: "red8",
            p: 3,
            mb: 3,
            borderRadius: "4px",
          }}
        >
          <p>
            <FaExclamationTriangle />{" "}
            <FormattedMessage
              id="Nettest.DeprecationWarning"
              values={{
                login: (string) => <Link href="/login">{string}</Link>,
              }}
            />
          </p>
        </Box>
        <Heading pt={2} h={2}>
          <FormattedMessage id="Nettest.Heading.HaveMobileApp" />
        </Heading>
        <Text pt={2} pb={3}>
          <FormattedMessage id="Nettest.Text.HaveMobileApp" />
        </Text>

        <Link href={deepLink}>
          <Button>
            <FormattedMessage id="Nettest.Button.Run" />
          </Button>
        </Link>

        <Heading pt={4} h={2}>
          <FormattedMessage id="Nettest.Heading.InstallApp" />
        </Heading>
        <Text pt={2} pb={3}>
          <FormattedMessage id="Nettest.Text.InstallApp" />
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
    </>
  )
}

export default Nettest
