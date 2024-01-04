import OONIRunHero from "components/OONIRunHero"
import RevisionView from "components/revisions/RevisionView"
import { getRunLink } from "lib/api"
import { GetServerSideProps } from "next"
import type { ParsedUrlQuery } from "querystring"

type Props = {
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
	query,
	params,
}) => {
	const { linkId } = params as QParams
	let runLinkDescriptor = null

	try {
		runLinkDescriptor = await getRunLink(linkId, {
			...(query?.datetime && { creation_time: query?.datetime }),
		})
	} catch (e) {}

	const props: Props = {
		linkId,
		runLinkDescriptor,
	}

	return { props }
}

const Nettest = ({ runLinkDescriptor, linkId }: Props) => {
	const descriptor = runLinkDescriptor?.descriptor
	const descriptorCreationTime =
		runLinkDescriptor?.descriptor_creation_time || ""
	const archived = !!runLinkDescriptor?.archived

	return (
		<>
			{descriptor && (
				<>
					<OONIRunHero />

					<RevisionView
						descriptor={descriptor}
						descriptorCreationTime={descriptorCreationTime}
						archived={archived}
						linkId={linkId}
					/>
				</>
			)}
		</>
	)
}

export default Nettest
