import Head from 'next/head'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './globalStyle'
import meta from '../config/meta'
import { getDirection } from 'pages/_app'
import { useIntl } from 'react-intl'

const Layout = props => {
  const { locale } = useIntl()
  return (
    <div>
      <Head>
        <title>{props.title || meta.defaultTitle}</title>
        <meta httpEquiv='Content-Type' content={meta.contentType} />
        <meta name='viewport' content={meta.viewport} />
      </Head>
      <GlobalStyle direction={getDirection(locale)} />
      <ThemeProvider theme={theme}>
        <div className='content'>
          { props.children }
        </div>
      </ThemeProvider>
    </div>
  )
}

export default Layout
