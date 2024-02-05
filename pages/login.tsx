import OONIRunHero from "components/OONIRunHero"
import LoginForm from "components/login/LoginForm"
// import SpinLoader from 'components/vendor/SpinLoader'
import useUser from "hooks/useUser"
import NLink from "next/link"
import { useRouter } from "next/router"
import { Box, Container, Flex, Heading, Text } from "ooni-components"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

const Login = () => {
  const router = useRouter()
  const { token } = router.query

  const [submitted, setSubmitted] = useState(false)

  const redirectTo =
    typeof window !== "undefined" ? window.location.origin : undefined

  const { user, loading, error } = useUser()

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (!loading && user && !token) {
      router.replace("/")
    }
  }, [user, loading, router, token])

  return (
    <>
      <OONIRunHero />
      <Container my={4}>
        <Flex alignItems="center" flexDirection="column">
          <Heading h={1} fontSize={[3, 5]}>
            <FormattedMessage id="Login.Title" />
          </Heading>
        </Flex>
        <Flex flexDirection="column">
          {/* Before logging In */}
          {!token && !submitted && (
            <>
              <Text fontSize={1} my={3} textAlign="center">
                <FormattedMessage id="Login.EnterEmail" />
              </Text>
              <Box style={{ width: "300px" }} alignSelf="center">
                <LoginForm
                  onLogin={() => setSubmitted(true)}
                  redirectTo={redirectTo}
                />
              </Box>
            </>
          )}
          {!token && submitted && (
            <Heading h={3} width={[1, 2 / 3]} textAlign="center" mx="auto">
              <FormattedMessage id="Login.Submitted" />
            </Heading>
          )}

          {/* While logging In */}
          {token && !user && !error && (
            <>
              {/* <SpinLoader /> */}
              {/* <h2>LOADING</h2> */}
              <Heading h={2} my={2} mx="auto">
                <FormattedMessage id="Login.LoggingIn" />
              </Heading>
            </>
          )}

          {/* After loggin in */}
          {user && !error && token && (
            <>
              <Text fontSize={3} my={2} mx="auto">
                <FormattedMessage id="Login.Success" />
              </Text>
            </>
          )}

          {/* Errors */}
          {error && (
            <Box width={[1, 1 / 3]} mx="auto" textAlign={"center"}>
              <Box mb={3} p={4} bg="red1">
                {error}
              </Box>
              <NLink href="/login">
                <FormattedMessage id="Login.Failure" />
              </NLink>
            </Box>
          )}
        </Flex>
      </Container>
    </>
  )
}

export default Login
