import OONIRunHero from 'components/OONIRunHero'
import { getRunLink } from 'lib/api'
import { GetServerSidePropsContext } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorDetails from 'components/DescriptorDetails'
import { Container, Button, Flex, Box, Heading } from 'ooni-components'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

import NLink from 'next/link'
import { generateRandomString } from 'utils'

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

const ViewRunLink = ({ linkId }: ViewRunLinkProps) => {
  const [randString] = useState(generateRandomString())

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

  const { data, error, isLoading } = useSWR(
    [linkId, { nocache: randString }],
    ([linkId, params]) => getRunLink(linkId, params)
  )

  // const { data: listData } = useSWR({ ids: linkId }, (props) => getList(props))

  // const revisionsList = useMemo(() => {
  //   if (listData?.descriptors?.length > 1) {
  //     const listCopy = [...listData?.descriptors]
  //     listCopy.reverse().shift()
  //     return listCopy
  //   } else {
  //     return []
  //   }
  // }, [listData])

  return (
    <>
      <OONIRunHero href="/" />
      {data?.descriptor && (
        <>
          <Container p={4}>
            <Flex justifyContent="end">
              {!!data?.mine && !data?.archived && (
                <NLink href={`/edit/${linkId}`}>
                  <Button type="button" hollow>
                    Edit
                  </Button>
                </NLink>
              )}
            </Flex>
            <DescriptorDetails
              descriptor={data.descriptor}
              descriptorCreationTime={data.descriptor_creation_time}
              archived={!!data.archived}
              runLink={runLink}
              deepLink={deepLink}
              linkId={linkId}
            />
          </Container>
        </>
      )}
    </>
  )
}

export default ViewRunLink
