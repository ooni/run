import { IntlProvider } from 'react-intl'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export const getDirection = locale => {
  switch (locale) {
    case 'fa':
    case 'ar':
      return 'rtl'
    default:
      return 'ltr'
  }
}

export default function MyApp({ Component, pageProps }) {
  const { locale, defaultLocale } = useRouter()

  const messages = useMemo(() => {
    try {
      const messages = require(`../public/static/lang/${locale}.json`)
      const defaultMessages = require(`../public/static/lang/${defaultLocale}.json`)

      const mergedMessages = Object.assign({}, defaultMessages, messages)
      return mergedMessages
    } catch (e) {
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