import Head from 'next/head'
import { useRouter } from 'next/router'
import { FormattedMessage, useIntl } from 'react-intl'

import OONIRunHero from 'components/OONIRunHero'
import OONI404 from 'public/static/images/OONI_404.svg'

const Custom404 = () => {
  const router = useRouter()
  const intl = useIntl()
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'Error.404.PageNotFound' })}</title>
      </Head>
      <OONIRunHero />
      <div className="container">
        <div className="flex items-center justify-center">
          <div>
            <h4 className="text-blue-500">
              <FormattedMessage id="Error.404.Heading" />
            </h4>
            <div className="mb-3">
              <FormattedMessage id="Error.404.Message" />
            </div>
          </div>
          <div className="p-32">
            <OONI404 height="500px" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Custom404
