import OONIRunHero from "components/OONIRunHero"
import useUser from "hooks/useUser"
import Markdown from "markdown-to-jsx"
import NLink from "next/link"
import { Box, Button, Container, Flex, Text } from "ooni-components"
import { useIntl } from "react-intl"
import { styled } from "styled-components"

const StyledCard = styled(Box)`
  border: 1px solid ${({ theme }) => theme.colors.gray4};
  border-radius: 8px;
  height: 100%;
  padding: 24px;
`

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const CardTitle = (props: any) => (
  <Text fontSize={1} fontWeight="bold" mb={3} {...props} />
)

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const CardText = (props: any) => (
  <Text sx={{ lineHeight: "1.3" }}>
    <Markdown {...props} />
  </Text>
)

const Home = () => {
  const intl = useIntl()
  const { user } = useUser()

  return (
    <>
      <OONIRunHero />
      <Container>
        <Text
          maxWidth="572px"
          fontSize={[1, 2]}
          lineHeight="24px"
          mx="auto"
          mt="40px"
          mb="24px"
        >
          <Markdown>{intl.formatMessage({ id: "Home.About" })}</Markdown>
        </Text>
        <Flex sx={{ gap: 3, flexDirection: ["column", "column", "row"] }}>
          <Box width={[1, 1, 1 / 3]}>
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: "Home.Box1.Title" })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: "Home.Box1.Description" })}
              </CardText>
            </StyledCard>
          </Box>
          <Box width={[1, 1, 1 / 3]}>
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: "Home.Box2.Title" })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: "Home.Box2.Description" })}
              </CardText>
            </StyledCard>
          </Box>
          <Box width={[1, 1, 1 / 3]}>
            <StyledCard>
              <CardTitle>
                {intl.formatMessage({ id: "Home.Box3.Title" })}
              </CardTitle>
              <CardText>
                {intl.formatMessage({ id: "Home.Box3.Description" })}
              </CardText>
            </StyledCard>
          </Box>
        </Flex>
        <Box textAlign="center" my={4}>
          {user?.is_logged_in ? (
            <NLink href="/create">
              <Button type="button" fontSize={[1, 2]} size="large">
                {intl.formatMessage({ id: "Home.Button.CreateRunLink" })}
              </Button>
            </NLink>
          ) : (
            <NLink href="/login">
              <Button type="button" fontSize={[1, 2]} size="large">
                {intl.formatMessage({ id: "Home.Button.Login" })}
              </Button>
            </NLink>
          )}
        </Box>
      </Container>
    </>
  )
}

export default Home
