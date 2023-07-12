import OONIRunHero from 'components/OONIRunHero'
import { getRunLink } from 'lib/api'
import { GetServerSidePropsContext } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorDetails from 'components/DescriptorDetails'
import { Container } from 'ooni-components'

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const { linkId } = params as QParams

  try {
    const runLink = await getRunLink(linkId)
    const descriptor = runLink?.descriptor

    return {
      props: {
        descriptor: descriptor,
        linkId,
      },
    }
  } catch (e) {
    return {
      props: {
        descriptor: null,
      },
    }
  }
}

type ViewRunLinkProps = {
  descriptor: Descriptor | null
  linkId: number
}

const ViewRunLink = ({ descriptor, linkId }: ViewRunLinkProps) => {
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : undefined
  const runLink = `${baseUrl}/v2/${linkId}`
  const deepLink = `ooni://runv2/${linkId}`

  return (
    <>
      <OONIRunHero href="/" />
      {descriptor && (
        <Container p={4}>
          <DescriptorDetails
            descriptor={descriptor}
            runLink={runLink}
            deepLink={deepLink}
          />
        </Container>
      )}
    </>
  )
}

export default ViewRunLink
