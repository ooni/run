import { UserProvider } from 'hooks/useUser'
import Head from 'next/head'

// import { getDirection } from "pages/_app"
import { useIntl } from 'react-intl'
import meta from '../config/meta'
import Footer from './Footer'

type LayoutProps = {
  title?: string
  children: React.ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  // const { locale } = useIntl()

  return (
    <div>
      <Head>
        <title>{title || meta.defaultTitle}</title>
        <meta httpEquiv="Content-Type" content={meta.contentType} />
        <meta name="viewport" content={meta.viewport} />
      </Head>

      <UserProvider>
        <div className="min-h-screen flex flex-col">
          <div className="content">{children}</div>
          <Footer />
        </div>
      </UserProvider>
    </div>
  )
}

export default Layout
