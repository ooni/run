import Head from 'next/head'
import { theme } from 'ooni-components'
import { ThemeProvider } from 'styled-components'
import GlobalStyle from './globalStyle'
import { UserProvider } from 'hooks/useUser'

import meta from '../config/meta'
import OONIRunHero from './OONIRunHero'
import Footer from './Footer'
import { Box } from 'ooni-components'

type LayoutProps = {
  title?: string
  children: React.ReactNode
}

const Layout = ({ title, children }: LayoutProps) => (
  <div>
    <Head>
      <title>{title || meta.defaultTitle}</title>
      <meta httpEquiv="Content-Type" content={meta.contentType} />
      <meta name="viewport" content={meta.viewport} />
    </Head>
    
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <UserProvider>
        <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
          <Box className="content">{children}</Box>
          <Footer />
        </Box>
      </UserProvider>
    </ThemeProvider>
  </div>
)

export default Layout
