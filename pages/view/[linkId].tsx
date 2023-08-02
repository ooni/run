import OONIRunHero from 'components/OONIRunHero'
import { getRunLink } from 'lib/api'
import { GetServerSidePropsContext } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorDetails from 'components/DescriptorDetails'
import { Container, Button, Flex } from 'ooni-components'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import NLink from 'next/link'
import useUser from 'hooks/useUser'

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const { linkId } = params as QParams

  // try {
  //   const runLink = await getRunLink(linkId)
  //   const descriptor = runLink?.descriptor

  //   return {
  //     props: {
  //       descriptor: descriptor,
  //       linkId,
  //     },
  //   }
  // } catch (e) {
  //   return {
  //     props: {
  //       descriptor: null,
  //     },
  //   }
  // }

  return {
    props: {
      linkId,
    },
  }
}

type ViewRunLinkProps = {
  descriptor: Descriptor | null
  linkId: string
}

const ViewRunLink = ({ descriptor, linkId }: ViewRunLinkProps) => {
  const { user } = useUser()
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const baseUrl = useMemo(
    () => (isClient ? window.location.origin : ''),
    [isClient]
  )

  const runLink = `${baseUrl}/v2/${linkId}`
  const deepLink = `ooni://runv2/${linkId}`

  const { data, error, isLoading } = useSWR(linkId, getRunLink)

  return (
    <>
      <OONIRunHero href="/" />
      {data?.descriptor && (
        <>
          <Container p={4}>
            <Flex justifyContent="end">
              {(data?.mine || isAdmin) && !data?.archived && (
                <NLink href={`/edit/${linkId}`}>
                  <Button type="button" hollow>
                    Edit
                  </Button>
                </NLink>
              )}
            </Flex>

            <DescriptorDetails
              descriptor={data.descriptor}
              archived={!!data.archived}
              runLink={runLink}
              deepLink={deepLink}
            />
          </Container>
        </>
      )}
    </>
  )
}

export default ViewRunLink
