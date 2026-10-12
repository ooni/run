import OONIRunHero from 'components/OONIRunHero'
import LoginForm from 'components/login/LoginForm'
// import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import { getSessionToken } from 'lib/api'
import Markdown from 'markdown-to-jsx'
import NLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

const Login = () => {
  const intl = useIntl()
  const router = useRouter()
  const tokenParam = router.query.token
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam

  const [submitted, setSubmitted] = useState(false)

  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${intl.locale}`
      : undefined

  const { user, loading, error, login } = useUser()
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setSessionToken(getSessionToken())
    }
  }, [user])

  // If user is already logged in, redirect to home page
  // useEffect(() => {
  //   if (!loading && user && !token) {
  //     router.replace('/')
  //   }
  // }, [user, loading, router, token])

  return (
    <>
      <OONIRunHero />
      <div className="container my-8">
        <div className="flex items-center flex-col">
          <h1>
            <FormattedMessage id="Login.Title" />
          </h1>
        </div>
        <div className="flex flex-col">
          {/* Before logging In */}
          {!token && !submitted && (
            <>
              <div className="text-base my-4 text-center">
                <Markdown>
                  {intl.formatMessage({ id: 'Login.EnterEmail' })}
                </Markdown>
              </div>
              <div className="w-[300px] self-center">
                <LoginForm
                  onLogin={() => setSubmitted(true)}
                  redirectTo={redirectTo}
                />
              </div>
            </>
          )}
          {!token && submitted && (
            <h3 className="w-full md:w-2/3 text-center mx-auto">
              <FormattedMessage id="Login.Submitted" />
            </h3>
          )}

          {/* While logging In */}
          {token && !user && !error && (
            <>
              {/* <h2 className="my-2 mx-auto text-center">
                <FormattedMessage id="Login.LoggingIn" />
              </h2> */}
              <div className="flex flex-col gap-3 items-center my-6">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={login}
                >
                  Start session in the browser
                </button>
                <a
                  className="btn btn-primary-hollow"
                  href={`ooni://login?token=${encodeURIComponent(token)}`}
                >
                  Open in OONI Probe app (with login token)
                </a>
              </div>
            </>
          )}

          {/* After loggin in */}
          {user && !error && token && (
            <>
              <div className="text-2xl my-2 mx-auto text-center">
                Successfully logged in.
              </div>
              <div className="flex flex-col gap-3 items-center my-6">
                <NLink href="/create" className="btn btn-primary">
                  <FormattedMessage id="Login.Button.CreateLink" />
                </NLink>
                {sessionToken && (
                  <a
                    className="btn btn-primary-hollow"
                    href={`ooni://login?token=${encodeURIComponent(sessionToken)}`}
                  >
                    Open in OONI Probe app (with session token)
                  </a>
                )}
              </div>
            </>
          )}

          {/* Errors */}
          {error && (
            <div className="w-full md:w-1/3 mx-auto text-center">
              <div className="mb-4 p-8 bg-red-100">{error}</div>
              <NLink href="/login">
                <FormattedMessage id="Login.Failure" />
              </NLink>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Login
