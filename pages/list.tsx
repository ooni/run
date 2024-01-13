import ListLoader from "components/ListLoader"
import { getList } from "lib/api"
import dynamic from "next/dynamic"
import { Box, Container, Heading } from "ooni-components"
import { useMemo } from "react"
import styled from "styled-components"
import useSWR from "swr"

const RunLinkList = dynamic(() => import("components/List"))
const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

const StyledBox = styled(Box)`
box-shadow: 0 50vh 0 50vh ${(props) => props.theme.colors.gray1};
`

const List = () => {
  const queryParams = { only_mine: true, include_archived: true }

  const { data, error, isLoading } = useSWR<{ descriptors: Descriptor[] }>(
    { only_latest: true, ...queryParams },
    (props: object) => getList(props),
  )

  const descriptors = useMemo(
    // archived links are shown at the end
    () =>
      data?.descriptors.sort(
        (a, b) => Number(a.archived) - Number(b.archived),
      ) || [],
    [data],
  )

  return (
    <>
      <OONIRunHero />
      <StyledBox bg="gray1">
        <Container py={4}>
          <Heading h={2} mb={2}>
            My OONI Run Links
          </Heading>
          {isLoading && <ListLoader />}
          {!!descriptors.length && <RunLinkList descriptors={descriptors} />}
        </Container>
      </StyledBox>
    </>
  )
}

export default List
