import { getList } from 'lib/api'
import { useMemo } from 'react'
import useSWR from 'swr'
import { Button, Box, Text, Heading, Flex } from 'ooni-components'
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
  short_description: string
}

type ListProps = {
  limit?: number
  queryParams?: {}
}
const List = ({ limit, queryParams }: ListProps) => {
  const { data, error, isLoading } = useSWR<{ descriptors: Descriptor[] }>(
    { only_latest: true, ...queryParams },
    (props) => getList(props)
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
              <ReactMarkdown>{desc.short_description}</ReactMarkdown>
              <Text my={3}>created by {desc.author}</Text>
              <span>{!!desc.archived && <>Archived</>}</span>
              <Flex justifyContent="end" sx={{ gap: 3 }}>
                <NLink href={`/view/${desc.id}`}>
                  <Button type="button" hollow>
                    View
                  </Button>
                </NLink>
                {!!desc.mine && (
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
