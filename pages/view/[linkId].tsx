import OONIRunHero from 'components/OONIRunHero'
import { getList, getRunLink } from 'lib/api'
import { GetServerSidePropsContext } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import DescriptorDetails from 'components/DescriptorDetails'
import { Container, Button, Flex, Box, Heading } from 'ooni-components'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import NLink from 'next/link'
import useUser from 'hooks/useUser'
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

const ViewRunLink = ({ descriptor, linkId }: ViewRunLinkProps) => {
  const { user } = useUser()
  const isAdmin = useMemo(() => user?.role === 'admin', [user])
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
  const { data: listData } = useSWR({ ids: linkId }, (props) => getList(props))

  const revisionsList = useMemo(() => {
    if (listData?.descriptors?.length > 1) {
      const listCopy = [...listData?.descriptors]
      listCopy.reverse().shift()
      return listCopy
    } else {
      return []
    }
  }, [listData])

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
            {!!revisionsList.length && (
              <>
                <Heading h={4}>Previous revisions:</Heading>
                {revisionsList.map((item: any) => (
                  <RunLinkRevision
                    key={item.descriptor_creation_time}
                    linkId={linkId}
                    creationTime={item.descriptor_creation_time}
                  />
                ))}
              </>
            )}
          </Container>
        </>
      )}
    </>
  )
}

export default ViewRunLink

type RunLinkRevisionProps = {
  creationTime: string
  linkId: string
}
const RunLinkRevision = ({ creationTime, linkId }: RunLinkRevisionProps) => {
  const { trigger, data } = useSWRMutation(
    [linkId, { creation_time: creationTime }],
    ([linkId, params]) => getRunLink(linkId, params)
  )
  return (
    <>
      <Box mb={2}>
        <Button
          variant="link"
          type="button"
          onClick={() => {
            trigger()
          }}
        >
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeStyle: 'long',
            timeZone: 'UTC',
          }).format(new Date(creationTime))}
        </Button>
      </Box>
      {data && (
        <Box mb={3} bg="gray1" p={3}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      )}
    </>
  )
}
