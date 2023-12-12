import Head from 'next/head'
import { Container, Box } from 'ooni-components'

import { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorView from 'components/v2/DescriptorView'
import { getRunLink } from 'lib/api'
import OONIRunHero from 'components/OONIRunHero'
import NLink from 'next/link'

type Props = {
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
  query,
  params
}) => {
  const { linkId } = params as QParams
 
  const description = 'Run OONI Probe'
  const title = 'OONI Run | Coordinate website censorship testing'
  let runLinkDescriptor = null

  try {
    runLinkDescriptor = await getRunLink(
      linkId, 
      { 
        ...(query?.datetime && {creation_time: query?.datetime}),
      }
    )
  } catch (e) {}

  const props: Props = {
    title,
    description,
    linkId,
    runLinkDescriptor
  }

  return { props }
}

const Nettest = ({
  title,
  description,
  runLinkDescriptor,
  linkId
}: Props) => {

  const descriptor = runLinkDescriptor?.descriptor
  const descriptorCreationTime = runLinkDescriptor?.descriptor_creation_time || ''
  const archived = !!runLinkDescriptor?.archived

  return (
    <>
      <Head>
        <meta name="twitter:card" content="app" />
        <meta name="twitter:site" content="@OpenObservatory" />

        {/* Open Graph meta tags. Shared by Twitter and Facebook */}
        <meta name="og:type" content="website" />
        {title && <meta name="og:title" content={title} />}
        <meta
          name="og:image"
          content="https://run.ooni.io/static/images/Run-VerticalColorW400px.png"
        />
        {description && <meta name="og:description" content={description} />}
      </Head>
      {descriptor && (
        <>
          <>
            <OONIRunHero />
            <Box bg='red9' color='white' textAlign='center' p={3}>This is a revision from {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeStyle: 'medium',
            timeZone: 'UTC',
          }).format(new Date(descriptorCreationTime))}. Back to <NLink href={`/v2/${linkId}`}>current link</NLink>.</Box>
            <Container p={4}>
              <DescriptorView
                descriptor={descriptor}
                descriptorCreationTime={descriptorCreationTime}
                archived={archived}
                linkId={linkId}
              />
            </Container>
          </>
        </>
      )}
    </>
  )
}

export default Nettest
