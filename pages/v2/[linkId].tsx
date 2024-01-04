import mobileApp from "config/mobileApp"
import { getRunLink } from "lib/api"
import { GetServerSideProps } from "next"
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

export default Nettest
