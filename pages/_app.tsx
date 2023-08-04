import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { useMemo, useEffect } from 'react'
import NProgress from 'nprogress'
import '../public/static/nprogress.css'

import type { AppProps } from 'next/app'
import Layout from 'components/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const { locale = 'en', defaultLocale } = router

  useEffect(() => {
    const handleStart = (url: string) => {
      console.log(`Loading: ${url}`)
      NProgress.configure
      NProgress.start()
    }

    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  const messages = useMemo(() => {
    try {
      const messages = require(`../public/static/lang/${locale}.json`)
      const defaultMessages = require(`../public/static/lang/${defaultLocale}.json`)

      const mergedMessages = Object.assign({}, defaultMessages, messages)
      return mergedMessages
    } catch (e: any) {
      console.error(`Failed to load messages for ${locale}: ${e.message}`)
      const defaultMessages = require(`../public/static/lang/${defaultLocale}.json`)
      return defaultMessages
    }
  }, [locale, defaultLocale])

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={defaultLocale}
      messages={messages}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </IntlProvider>
  )
}

export default MyApp
