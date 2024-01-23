import { getList } from "lib/api"
import type { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import { Box, Container, Heading } from "ooni-components"
import styled from "styled-components"

const RunLinkList = dynamic(() => import("components/List"))
const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

const StyledBox = styled(Box)`
box-shadow: 0 50vh 0 50vh ${(props) => props.theme.colors.gray1};
`

export const getServerSideProps = (async ({ req }) => {
  const { cookies } = req
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  if (!authToken)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }

  const response = await getList(
    {
      only_latest: true,
      only_mine: true,
      include_archived: true,
    },
    {
      ...(authToken && {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    },
  )

  const descriptors: Descriptor[] =
    (await response.descriptors.sort(
      // archived links are shown at the end
      (a: Descriptor, b: Descriptor) => Number(a.archived) - Number(b.archived),
    )) || []

  return { props: { descriptors } }
}) satisfies GetServerSideProps<{ descriptors: Descriptor[] }>

const List = ({ descriptors = [] }) => {
  return (
    <>
      <OONIRunHero />
      <StyledBox bg="gray1">
        <Container py={4}>
          <Heading h={2} mb={2}>
            My OONI Run Links
          </Heading>
          {!!descriptors.length && <RunLinkList descriptors={descriptors} />}
        </Container>
      </StyledBox>
    </>
  )
}

export default List
