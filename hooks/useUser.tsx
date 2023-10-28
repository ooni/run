import { useRouter } from 'next/router'
import {
  useEffect,
  useState,
  useCallback,
  useContext,
  createContext,
  useMemo,
} from 'react'

import { apiEndpoints, loginUser, refreshToken, getAPI } from 'lib/api'

const TWELVE_HOURS = 1000 * 60 * 60 * 12
const TEN_MINUTES = 1000 * 60 * 10

type User = {
  role: 'admin' | 'user'
  logged_in: boolean
}

type UserContext = {
  user: null | User
  loading: boolean
  error: null | string
  logout: () => void
  // login: () => void
}

const UserContext = createContext<UserContext>({
  user: null,
  loading: false,
  error: null,
  logout: () => {},
  // login: () => {},
})

type UserProviderProps = {
  children: React.ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const router = useRouter()
  const token = router.query?.token
    ? Array.isArray(router.query.token)
      ? router.query.token[0]
      : router.query.token
    : null
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  // const [loadingInitial, setLoadingInitial] = useState(true)

  const getUser = () => {
    // setLoading(true)
    return getAPI(apiEndpoints.ACCOUNT_METADATA)
      .then((user) => {
        setUser(user)
      })
      .catch((e) => {
        console.log('user not logged in')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }

  const afterLogin = useCallback(
    (redirectTo: string) => {
      const { pathname, searchParams } = new URL(redirectTo)
      setTimeout(() => {
        router.push({ pathname, query: Object.fromEntries([...searchParams]) })
      }, 3000)
    },
    [router]
  )

  useEffect(() => {
    if (token && router.pathname === '/login') {
      loginUser(token)
        .then((data) => {
          getUser()
          if (data?.redirect_to) afterLogin(data.redirect_to)
        })
        .catch((e) => {
          console.log(e)
          setError(e.message)
        })
    } else {
      setError(null)
    }
  }, [afterLogin, token, router.pathname])

  useEffect(() => {
    getUser()
  }, [])

  // periodically check if the token need to be refreshed and request a
  // new one if needed
  useEffect(() => {
    const interval = setInterval(() => {
      const tokenCreatedAt = JSON.parse(
        localStorage.getItem('bearer') || '{}'
      )?.created_at
      if (tokenCreatedAt) {
        const tokenExpiry = tokenCreatedAt + TWELVE_HOURS
        const now = Date.now()
        if (now > tokenExpiry) {
          refreshToken().catch((e) => {
            if (e?.response?.status === 401) {
              localStorage.removeItem('bearer')
              getUser()
            }
          })
        }
      }
    }, TEN_MINUTES)

    return () => clearInterval(interval)
  }, [])

  // const login = () => {
  //   if (token) {
  //     // setLoading(true)
  //     loginUser(token)
  //       .then((data) => {
  //         setUser(data)
  //         if (data?.redirect_to) afterLogin(data.redirect_to)
  //       })
  //       .catch((e: Error) => {
  //         console.log(e)
  //         setError(error)
  //       })
  //       .finally(() => setLoading(false))
  //   }
  // }

  const logout = () => {
    localStorage.removeItem('bearer')
    getUser()
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      // login,
      logout,
    }),
    [user, loading, error]
  )

  return (
    <UserContext.Provider value={memoedValue}>{children}</UserContext.Provider>
  )
}

const useUser = () => {
  return useContext(UserContext)
}

export default useUser
