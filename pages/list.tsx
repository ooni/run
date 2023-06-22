import OONIRunHero from 'components/OONIRunHero'
import { apiEndpoints, fetcher } from 'lib/api'
import { useMemo } from 'react'
import useSWR from 'swr'
import { Container, Button, Box, Text, Heading, Flex } from 'ooni-components'
import { useRouter } from 'next/router'
import useUser from 'hooks/useUser'
import NLink from 'next/link'
import styled from 'styled-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import Layout from 'components/Layout'

const StyledBox = styled(Box)`
  border: 1px solid gray;
  border-radius: 5px;
  padding: ${(props) => props.theme.space[3]}px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
`

const List = () => {
  const router = useRouter()
  const { user, loading } = useUser()
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  const { data, error } = useSWR(apiEndpoints.GET_LIST, fetcher)
  console.log('data', data)
  return (
    <>
      <OONIRunHero href="/" />
      <Container my={5}>
        <ul>
          {data &&
            data.descriptors.map(
              (desc: { id: string; archived: boolean; mine: boolean }) => (
                <li key={desc.id}>
                  <StyledBox>
                    <Heading h={4}>{desc.name}</Heading>
                    <ReactMarkdown>{desc.description}</ReactMarkdown>
                    <Text my={3}>created by {desc.author}</Text>
                    <span>{!!desc.archived && <>Archived</>}</span>
                    <Flex justifyContent="end" sx={{ gap: 3 }}>
                      <NLink href={`/view/${desc.id}`}>
                        <Button type="button">View</Button>
                      </NLink>
                      {(desc.mine || isAdmin) && (
                        <NLink href={`/edit/${desc.id}`}>
                          <Button type="button">Edit</Button>
                        </NLink>
                      )}
                    </Flex>
                  </StyledBox>
                </li>
              )
            )}
        </ul>
      </Container>
    </>
  )
}

export default List
