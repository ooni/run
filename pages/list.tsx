import { getList } from "lib/api"
import type { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import NLink from "next/link"
import { Box, Button, Container, Flex, Heading } from "ooni-components"
import { useIntl } from "react-intl"
import styled from "styled-components"
import OONI404 from "/public/static/images/OONI_404.svg"

const RunLinkList = dynamic(() => import("components/List"))
const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

const StyledBox = styled(Box)`
box-shadow: 0 50vh 0 50vh ${(props) => props.theme.colors.gray1};
`

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { cookies } = req
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  if (!authToken)
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }

  try {
    const response = await getList(
      {
        is_mine: true,
        is_expired: true,
      },
      {
        ...(authToken && {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        baseURL: process.env.NEXT_PUBLIC_OONI_API,
      },
    )
    const runLinks = await response?.oonirun_links?.sort(
      // archived links are shown at the end
      (a: Descriptor, b: Descriptor) =>
        Number(a.is_expired) - Number(b.is_expired),
    )

    return { props: { runLinks } }
  } catch (error) {
    return { props: { error: `Error: ${error}` } }
  }
}

type ListProps = {
  runLinks?: Descriptor[]
  error?: string
}

const List = ({ runLinks = [], error }: ListProps) => {
  const intl = useIntl()

  return (
    <>
      <OONIRunHero />
      <StyledBox bg="gray1">
        <Container py={4}>
          <Heading h={2} mb={2}>
            {intl.formatMessage({ id: "List.Title" })}
          </Heading>
          {runLinks.length ? (
            <RunLinkList runLinks={runLinks} />
          ) : (
            <Flex
              p="24px"
              sx={{
                gap: 4,
                border: "1px solid",
                borderColor: "gray3",
                borderRadius: "8px",
                bg: "white",
              }}
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <Box>
                <Heading h={3} mb={3}>
                  {intl.formatMessage({ id: "List.Empty" })}
                </Heading>
                <NLink href="/create">
                  <Button>
                    {intl.formatMessage({ id: "List.Button.Create" })}
                  </Button>
                </NLink>
              </Box>
              <Box>
                <OONI404 height="200px" />
              </Box>
            </Flex>
          )}
        </Container>
      </StyledBox>
    </>
  )
}

export default List
