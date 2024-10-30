import Axios, { type AxiosError } from 'axios'
import cookie from 'cookie'

export const apiEndpoints = {
  USER_SESSION: '/api/v2/ooniauth/user-session',
  USER_LOGIN: '/api/v2/ooniauth/user-login',
  RUN_LINK: '/api/v2/oonirun/links',
  RUN_LINK_REVISION:
    '/api/v2/oonirun/links/:linkId/full-descriptor/:revisionNr',
}

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60
const setCookie = (tokenDetails: string) => {
  return `token=${tokenDetails}; Path=/; Max-Age=${SEVEN_DAYS_IN_SECONDS}; SameSite=Strict; Secure`
}

const getBearerToken = () => {
  return typeof document !== 'undefined' && cookie.parse(document.cookie)?.token
    ? JSON.parse(cookie.parse(document.cookie)?.token)?.token
    : null
}

export const getTokenCreatedAt = () => {
  return typeof document !== 'undefined' && cookie.parse(document.cookie)?.token
    ? JSON.parse(cookie.parse(document.cookie)?.token)?.created_at
    : null
}

export const getUserEmail = () => {
  return typeof document !== 'undefined' && cookie.parse(document.cookie)?.token
    ? JSON.parse(cookie.parse(document.cookie)?.token)?.email_address
    : null
}

const axios = Axios.create({ withCredentials: false })

type Config = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any
  method?: string
}

export const getAPI = async (endpoint: string, config: Config = {}) => {
  const bearerToken = getBearerToken()
  return await axios
    .request({
      method: config.method ?? 'GET',
      url: endpoint,
      ...(bearerToken && {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }),
      ...config,
    })
    .then((res) => res.data)
    .catch((e: Error | AxiosError) => {
      if (Axios.isAxiosError(e)) {
        const error = JSON.stringify(
          e?.response?.data?.error || e?.response?.data?.detail || e?.message,
        )
        throw new Error(error)
      }
      throw new Error(e.message)
    })
}

const postAPI = async (endpoint: string, data = {}, params = {}) => {
  return await getAPI(endpoint, { method: 'POST', data, params })
}

const putAPI = async (endpoint: string, data = {}, params = {}) => {
  return await getAPI(endpoint, { method: 'PUT', data, params })
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createRunLink = (data: any, params = {}) => {
  return postAPI(apiEndpoints.RUN_LINK, data, params)
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const updateRunLink = (id: string, data: any) => {
  return putAPI(`${apiEndpoints.RUN_LINK}/${id}`, data)
}

export const getRunLink = (id: string, config = {}) => {
  return getAPI(`${apiEndpoints.RUN_LINK}/${id}`, config)
}

export const getRunLinkRevision = (
  id: string,
  revision: string,
  config = {},
) => {
  return getAPI(
    apiEndpoints.RUN_LINK_REVISION.replace(':linkId', id).replace(
      ':revisionNr',
      revision,
    ),
    config,
  )
}

export const getList = (params = {}, config = {}) => {
  return getAPI(apiEndpoints.RUN_LINK, { ...config, params })
}

export const registerUser = async (
  email_address: string,
  redirectUrl = 'https://run.ooni.org',
) => {
  // current testing setup does not enable us to check process.env.NODE_ENV (it's set to production
  // in headless mode), therefore custom NEXT_PUBLIC_IS_TEST_ENV is used
  const redirectTo =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_IS_TEST_ENV
      ? 'https://run.test.ooni.org'
      : redirectUrl
  return await postAPI(apiEndpoints.USER_LOGIN, {
    email_address,
    redirect_to: redirectTo,
  })
}

export const loginUser = (login_token: string) => {
  return postAPI(apiEndpoints.USER_SESSION, { login_token }).then((data) => {
    console.log('data', data)
    const tokenDetails = JSON.stringify({
      token: data?.session_token,
      email_address: data?.email_address,
      created_at: Date.now(),
    })
    document.cookie = setCookie(tokenDetails)
    return data
  })
}

export const refreshToken = () => {
  const email_address = getUserEmail()
  return postAPI(apiEndpoints.USER_SESSION).then((data) => {
    const tokenDetails = JSON.stringify({
      token: data.login_token,
      email_address,
      created_at: Date.now(),
    })
    document.cookie = setCookie(tokenDetails)
  })
}

export const fetcher = async (url: string, params?: object) => {
  try {
    const res = await getAPI(url, params)
    return res
  } catch (e: unknown) {
    if (Axios.isAxiosError(e)) {
      throw new Error(e?.response?.data?.error)
      // error.info = e?.response?.statusText
      // error.status = e?.response?.status
    }
    const error = e as Error
    throw new Error(error.message)
  }
}

export const postFetcher = async (url: string) => {
  try {
    const res = await postAPI(url)
    return res
  } catch (e: unknown) {
    if (Axios.isAxiosError(e)) {
      throw new Error(e?.response?.data?.error)
    }
    const error = e as Error
    throw new Error(error.message)
  }
}

// export const customErrorRetry = (error, key, config, revalidate, opts) => {
//   // This overrides the default exponential backoff algorithm
//   // Instead it uses the `errorRetryInterval` and `errorRetryCount` configuration to
//   // limit the retries
//   const maxRetryCount = config.errorRetryCount
//   if (maxRetryCount !== undefined && opts.retryCount > maxRetryCount) return
//   // Never retry on 4xx errors
//   if (Math.floor(error.status / 100) === 4) return

//   setTimeout(revalidate, config.errorRetryInterval, opts)
// }
