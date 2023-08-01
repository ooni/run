import { apiEndpoints, fetcher } from 'lib/api'
import { useMemo } from 'react'
import useSWR from 'swr'
import { Button, Box, Text, Heading, Flex } from 'ooni-components'
import useUser from 'hooks/useUser'
import NLink from 'next/link'
import styled from 'styled-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import ListLoader from 'components/ListLoader'

const StyledBox = styled(Box)`
  border: 1px solid gray;
  border-radius: 5px;
  padding: ${(props) => props.theme.space[3]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`

type Descriptor = {
  id: string
  author: string
  archived: boolean
  mine: boolean
  name: string
  description: string
}

type ListProps = {
  limit?: number
}
const List = ({ limit }: ListProps) => {
  const { user } = useUser()
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  const { data, error, isLoading } = useSWR<{ descriptors: Descriptor[] }>(
    apiEndpoints.GET_LIST,
    (url) => fetcher(url, { only_latest: true })
  )

  const descriptors = useMemo(
    () => (limit ? data?.descriptors.slice(0, limit) : data?.descriptors),
    [data]
  )

  return (
    <>
      {isLoading && <ListLoader />}
      <ul>
        {descriptors?.map((desc) => (
          <li key={desc.id}>
            <StyledBox>
              <NLink href={`/view/${desc.id}`}>
                <Heading h={4}>{desc.name}</Heading>
              </NLink>
              <ReactMarkdown>{desc.description}</ReactMarkdown>
              <Text my={3}>created by {desc.author}</Text>
              <span>{!!desc.archived && <>Archived</>}</span>
              <Flex justifyContent="end" sx={{ gap: 3 }}>
                <NLink href={`/view/${desc.id}`}>
                  <Button type="button" hollow>
                    View
                  </Button>
                </NLink>
                {(desc.mine || isAdmin) && (
                  <NLink href={`/edit/${desc.id}`}>
                    <Button type="button" hollow>
                      Edit
                    </Button>
                  </NLink>
                )}
              </Flex>
            </StyledBox>
          </li>
        ))}
      </ul>
    </>
  )
}

export default List
