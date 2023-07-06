import RunLinkList from 'components/List'
import OONIRunHero from 'components/OONIRunHero'
import useUser from 'hooks/useUser'
import Markdown from 'markdown-to-jsx'
import NLink from 'next/link'
import { Box, Text, Flex, Heading } from 'ooni-components'
import { Button } from 'ooni-components'
import { Container } from 'ooni-components'
import { useIntl } from 'react-intl'
import { styled } from 'styled-components'

const StyledCard = styled(Box)`
  text-align: center;
  border: 1px solid black;
  border-radius: 12px;
  height: 100%;
  padding: 20px;
`

const CardTitle = (props: any) => (
  <Text fontSize={2} fontWeight="bold" mb={3} {...props} />
)

const CardText = (props: any) => <Text sx={{ lineHeight: '1.3' }} {...props} />

const Home = () => {
  const intl = useIntl()
  const { user } = useUser()

  return (
    <>
      <OONIRunHero href="/" />
      <Container>
        <Box my={5}>
          <Text
            maxWidth="860px"
            fontSize={3}
            textAlign="center"
            margin="0 auto"
          >
            <Markdown>{intl.formatMessage({ id: 'Home.About' })}</Markdown>
          </Text>
        </Box>
        <Flex sx={{ gap: 3 }}>
          <Box width={[1, 1 / 3]}>
            <StyledCard>
              <CardTitle>Engage your friends</CardTitle>
              <CardText>
                With OONI Run, you can choose which websites you want to test
                for censorship. Simply select “Web Connectivity” and add as many
                URLs as you like. Generate a link that you can share with your
                friends. If they already have OONI Probe installed, the link
                will open their mobile app and automatically start testing the
                sites of your choice! Otherwise, it will encourage them to
                install OONI Probe first.
              </CardText>
            </StyledCard>
          </Box>
          <Box width={[1, 1 / 3]}>
            <StyledCard>
              <CardTitle>Engage the world</CardTitle>
              <CardText>
                OONI Run can help build a global network for rapid response to
                emergent censorship events. By tweeting a generated link, you
                can encourage the world to run the tests (and to test the sites)
                you’ve chosen. If you suspect that a site might be censored
                during political events, add that site to OONI Run, generate a
                link, and share it with people in that country. If you heard
                rumors of censorship, engage people in that country to collect
                data that can serve as evidence.
              </CardText>
            </StyledCard>
          </Box>
          <Box width={[1, 1 / 3]}>
            <StyledCard>
              <CardTitle>Monitor your site</CardTitle>
              <CardText>
                Perhaps your site has been blocked by some governments and
                you’re unsure how the censorship is implemented or whether it’s
                blocked across all networks. Or perhaps you’re just interested
                in having data that can serve as evidence that your site was
                intentionally censored.
              </CardText>
            </StyledCard>
          </Box>
        </Flex>
        <Box textAlign="center" my={4}>
          {user?.logged_in ? (
            <NLink href="/create">
              <Button type="button" btnSize="large" hollow>
                Create OONI Run Link
              </Button>
            </NLink>
          ) : (
            <NLink href="/login">
              <Button type="button" btnSize="large" hollow>
                Login to create OONI Run Link
              </Button>
            </NLink>
          )}
        </Box>
        <Box>
          <Heading textAlign="center" h={3} mt={5} mb={3}>
            Recently created OONI Run links
          </Heading>
          <RunLinkList />
          <Box textAlign="center" my={4}>
            <NLink href="/list">
              <Button type="button" hollow>
                View more
              </Button>
            </NLink>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default Home
