import Axios, { AxiosError } from 'axios'
import { generateRandomString } from 'utils'

export const apiEndpoints = {
  ACCOUNT_METADATA: '/api/_/account_metadata',
  TOKEN_REFRESH: '/api/v1/user_refresh_token',
  USER_REGISTER: '/api/v1/user_register',
  USER_LOGIN: '/api/v1/user_login',
  USER_LOGOUT: '/api/v1/user_logout',
  CREATE_RUN_LINK: '/api/_/ooni_run/create',
  ARCHIVE_RUN_LINK: '/api/_/ooni_run/archive/:oonirun_id',
  GET_RUN_LINK: '/api/_/ooni_run/fetch',
  GET_LIST: '/api/_/ooni_run/list',
}

const getBearerToken = () => {
  return typeof localStorage !== 'undefined'
    ? JSON.parse(localStorage.getItem('bearer') || '{}')?.token
    : ''
}

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_OONI_API,
})

type Config = {
  [key: string]: any
  method?: string
}

export const getAPI = async (
  endpoint: string,
  params = {},
  config: Config = {}
) => {
  const bearerToken = getBearerToken()
  return await axios
    .request({
      method: config.method ?? 'GET',
      url: endpoint,
      params: params,
      ...config,
      ...(bearerToken && {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }),
    })
    .then((res) => res.data)
    .catch((e: Error | AxiosError) => {
      if (Axios.isAxiosError(e)) {
        console.log('err', e)
        throw new Error(e?.response?.data?.error)
        // error.info = e?.response?.statusText
        // error.status = e?.response?.status
      } else {
        throw new Error(e.message)
      }
    })
}

const postAPI = async (endpoint: string, data = {}, params = {}) => {
  return await getAPI(endpoint, params, { method: 'POST', data })
}

export const createRunLink = (data: any, params = {}) => {
  return postAPI(apiEndpoints.CREATE_RUN_LINK, data, params)
}

export const getRunLink = (id: string) => {
  return getAPI(
    `${apiEndpoints.GET_RUN_LINK}/${id}?nocache=${generateRandomString()}`
  )
}

export const getLinkList = () => {
  return getAPI(apiEndpoints.GET_LIST)
}

export const registerUser = async (
  email_address: string,
  redirectUrl = 'https://run.ooni.io'
) => {
  // current testing setup does not enable us to check process.env.NODE_ENV (it's set to production
  // in headless mode), therefore custom NEXT_PUBLIC_IS_TEST_ENV is used
  const redirectTo =
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_IS_TEST_ENV
      ? 'https://run.test.ooni.org/'
      : redirectUrl

  const data = await postAPI(apiEndpoints.USER_REGISTER, {
    email_address,
    redirect_to: redirectTo,
  })
  return data
}

export const loginUser = (token: string) => {
  return axios
    .get(apiEndpoints.USER_LOGIN, { params: { k: token } })
    .then(({ data }) => {
      localStorage.setItem(
        'bearer',
        JSON.stringify({ token: data?.bearer, created_at: Date.now() })
      )
      return data
    })
}

export const refreshToken = () => {
  return getAPI(apiEndpoints.TOKEN_REFRESH).then((data) => {
    localStorage.setItem(
      'bearer',
      JSON.stringify({ token: data.bearer, created_at: Date.now() })
    )
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
    } else {
      const error = e as Error
      throw new Error(error.message)
    }
  }
}

export const postFetcher = async (url: string) => {
  try {
    const res = await postAPI(url)
    return res
  } catch (e: unknown) {
    if (Axios.isAxiosError(e)) {
      throw new Error(e?.response?.data?.error)
    } else {
      const error = e as Error
      throw new Error(error.message)
    }
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
