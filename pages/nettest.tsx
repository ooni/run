import OONIRunHeroMinimal from 'components/OONIRunHeroMinimal'
import MetaTags from 'components/v2/MetaTags'
import type { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'node:querystring'
import { FaExclamationTriangle } from 'react-icons/fa'
import { FormattedMessage } from 'react-intl'
import { getEncodedQuery } from 'utils/links'
import mobileApp from '../config/mobileApp'

const installLink = 'https://ooni.org/install'

const getCustomURI = (query: ParsedUrlQuery) => {
  let uri = 'ooni://nettest?'
  uri += getEncodedQuery(query)
  return uri
}

const getUniversalLink = (query: ParsedUrlQuery) => {
  let uri = 'https://run.ooni.io/nettest?'
  uri += getEncodedQuery(query)
  return uri
}

type Props = {
  deepLink: string
  installLink: string
  userAgent: string | undefined
  universalLink: string
  title: string
  description: string
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  query,
}) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent

  const deepLink = getCustomURI(query)
  const description = 'Run OONI Probe'
  const title = 'OONI Run | Coordinate website censorship testing'
  const universalLink = getUniversalLink(query)

  const props: Props = {
    deepLink,
    installLink,
    userAgent,
    universalLink,
    title,
    description,
  }

  return { props }
}

const Nettest = ({
  userAgent,
  deepLink,
  installLink,
  universalLink,
  title,
  description,
}: Props) => {
  return (
    <>
      <MetaTags
        title={title}
        description={description}
        mobileApp={mobileApp}
        deepLink={deepLink}
        universalLink={universalLink}
      />
      <OONIRunHeroMinimal />
      <div className="container p-8">
        <div className="border-2 border-red-800 text-red-800 p-4 mb-4 rounded-md">
          <p>
            <FaExclamationTriangle />{' '}
            <FormattedMessage
              id="Nettest.DeprecationWarning"
              values={{
                login: (string) => <a href="/login">{string}</a>,
              }}
            />
          </p>
        </div>
        <h2 className="pt-2">
          <FormattedMessage id="Nettest.Heading.HaveMobileApp" />
        </h2>
        <div className="pt-2 pb-4">
          <FormattedMessage id="Nettest.Text.HaveMobileApp" />
        </div>

        <a href={deepLink}>
          <button type="button" className="btn btn-primary">
            <FormattedMessage id="Nettest.Button.Run" />
          </button>
        </a>

        <h2 className="pt-8">
          <FormattedMessage id="Nettest.Heading.InstallApp" />
        </h2>
        <div className="pt-2 pb-4">
          <FormattedMessage id="Nettest.Text.InstallApp" />
        </div>

        <a href={installLink}>
          <button type="button" className="btn btn-primary">
            <FormattedMessage id="Nettest.Button.Install" />
          </button>
        </a>

        <div className="mt-16">
          <code className="font-mono">{userAgent}</code>
        </div>
      </div>
    </>
  )
}

export default Nettest
