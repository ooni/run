import OONIRunHero from "components/OONIRunHero"
import OONIRunHeroMinimal from "components/OONIRunHeroMinimal"
import RevisionView from "components/revisions/RevisionView"
import { getRunLink } from "lib/api"
import { GetServerSideProps } from "next"
import type { ParsedUrlQuery } from "querystring"

type Props = {
  runLink: Descriptor
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
  let runLink = null

  try {
    runLink = await getRunLink(linkId, {
      ...(query?.revision && { params: { revision: query?.revision } }),
      ...(authToken && {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      baseURL: process.env.NEXT_PUBLIC_OONI_API,
    })
  } catch (e) {}

  const props: Props = {
    linkId,
    runLink,
  }

  return { props }
}

const Nettest = ({ runLink, linkId }: Props) => {
  const isMine = !!runLink?.is_mine

  return (
    <>
      {isMine ? <OONIRunHero /> : <OONIRunHeroMinimal />}
      {runLink && <RevisionView descriptor={runLink} linkId={linkId} />}
    </>
  )
}

export default Nettest
