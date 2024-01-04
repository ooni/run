import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  const { locale = 'en', defaultLocale } = useRouter()

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
      <Component {...pageProps} />
    </IntlProvider>
  )
}

export default MyApp