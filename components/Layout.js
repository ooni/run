import Head from 'next/head'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'

import meta from '../config/meta'
import GlobalStyle from './GlobalStyle'

const Layout = props => (
  <div>
    <Head>
      <title>{props.title || meta.defaultTitle}</title>
      <meta httpEquiv='Content-Type' content={meta.contentType} />
      <meta name='viewport' content={meta.viewport} />
    </Head>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className='content'>
        { props.children }
      </div>
    </ThemeProvider>
  </div>
)

export default Layout
