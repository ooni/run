import OONIRunHero from "components/OONIRunHero"
import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
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
  req,
  query,
  params,
}) => {
  const { cookies } = req
  const { linkId } = params as QParams
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null
  let runLinkDescriptor = null

  try {
    runLinkDescriptor = await getRunLink(
      linkId,
      {
        ...(query?.datetime && { creation_time: query?.datetime }),
      },
      {
        ...(authToken && {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      },
    )
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
  const isMine = !!runLinkDescriptor?.mine

  return (
    <>
      {isMine ? <OONIRunHero /> : <OONIRunHeroMinimal />}
      {descriptor && (
        <RevisionView
          descriptor={descriptor}
          descriptorCreationTime={descriptorCreationTime}
          archived={archived}
          linkId={linkId}
        />
      )}
    </>
  )
}

export default Nettest
