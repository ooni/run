import Head from 'next/head'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './globalStyle'

import meta from '../config/meta'

const Layout = props => (
  <div>
    <Head>
      <title>{props.title || meta.defaultTitle}</title>
      <meta httpEquiv='Content-Type' content={meta.contentType} />
      <meta name='viewport' content={meta.viewport} />
    </Head>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <div className='content'>
        { props.children }
      </div>
    </ThemeProvider>
  </div>
)

export default Layout
