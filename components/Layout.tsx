import Head from 'next/head'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './globalStyle'
import { UserProvider } from 'hooks/useUser'

import meta from '../config/meta'

type LayoutProps = {
  title?: string
  children: JSX.Element | JSX.Element[]
}

const Layout = ({ title, children }: LayoutProps) => (
  <div>
    <Head>
      <title>{title || meta.defaultTitle}</title>
      <meta httpEquiv="Content-Type" content={meta.contentType} />
      <meta name="viewport" content={meta.viewport} />
    </Head>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <UserProvider>
        <div className="content">{children}</div>
      </UserProvider>
    </ThemeProvider>
  </div>
)

export default Layout