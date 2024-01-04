import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
import MetaTags from "components/v2/MetaTags"
import { GetServerSideProps } from "next"
import { Box, Button, Container, Heading, Link, Text } from "ooni-components"
import { ParsedUrlQuery } from "querystring"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"
import { getEncodedQuery, getIntentURI } from "utils/links"
import mobileApp from "../config/mobileApp"

const StyledCode = styled.code`
  font-family: courier, monospace;
`

const useragent = require("useragent/index.js")

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
	withWindowLocation: boolean
	storeLink: string
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
	const ua = useragent.parse(userAgent)

	const deepLink = getCustomURI(query)
	const description = "Run OONI Probe"
	const title = "OONI Run | Coordinate website censorship testing"
	const universalLink = getUniversalLink(query)

	let storeLink
	let withWindowLocation = false

	if (ua.os.family === "iOS") {
		storeLink = mobileApp.appStoreLink
	} else {
		storeLink = mobileApp.googlePlayLink
	}

	if (ua.os.family === "Android") {
		// Accordingy to
		// https://developer.chrome.com/multidevice/android/intents
		// this is the preferred method for Chrome mobile >= 25
		if (ua.family === "Chrome Mobile" && Number(ua.major) >= 25) {
			return {
				redirect: {
					destination: getIntentURI(query),
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

	const props: Props = {
		deepLink,
		withWindowLocation,
		storeLink,
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
	withWindowLocation,
	storeLink,
	installLink,
	universalLink,
	title,
	description,
}: Props) => {
	const windowScript = `window.onload = function() {
    document.getElementById('l').src = '${deepLink}';
    setTimeout(function() {
      window.location = '${storeLink}';
    }, 500)
  }`

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
						<FormattedMessage
							id="Nettest.Button.Install"
							defaultMessage="Install"
						/>
					</Button>
				</Link>

				<Box mt={5}>
					<StyledCode>{userAgent}</StyledCode>
				</Box>
			</Container>
			<>
				{withWindowLocation && (
					<script
						type="text/javascript"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: windowScript }}
					/>
				)}
			</>
			<>
				{withWindowLocation && (
					<iframe
						title="OONIProbe"
						id="l"
						width="1"
						height="1"
						style={{ visibility: "hidden" }}
					/>
				)}
			</>
		</>
	)
}

export default Nettest
