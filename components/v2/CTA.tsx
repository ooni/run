import Image from 'next/image'
import { FormattedMessage, useIntl } from 'react-intl'

type CTAProps = {
  linkTitle: string
  deepLink: string
}

const CTA = ({ linkTitle, deepLink }: CTAProps) => {
  const intl = useIntl()
  return (
    <div className="bg-white p-6 border border-blue-600">
      <h2>{linkTitle}</h2>
      <h3 className="pt-2">
        <FormattedMessage id="Nettest.Heading.HaveMobileApp" />
      </h3>
      <div className="pt-2 pb-4">
        <FormattedMessage id="Nettest.Text.HaveMobileApp" />
      </div>

      <a href={deepLink}>
        <button type="button" className="btn btn-primary">
          <FormattedMessage id="Nettest.Button.Run" />
        </button>
      </a>

      <h3 className="pt-8">
        <FormattedMessage id="Nettest.Heading.InstallApp" />
      </h3>
      <div className="pt-2 pb-4">
        <FormattedMessage id="Nettest.Text.InstallApp" />
      </div>

      <div className="flex gap-3">
        <a
          href="https://play.google.com/store/apps/details?id=org.openobservatory.ooniprobe"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/static/images/google-play-badge.svg"
            alt={intl.formatMessage({ id: 'Nettest.DownloadAndroid' })}
            height="56"
            width="189"
          />
        </a>
        <a
          href="https://itunes.apple.com/us/app/id1199566366"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/static/images/apple-store-badge.svg"
            alt={intl.formatMessage({ id: 'Nettest.DownloadIOS' })}
            height="56"
            width="168"
          />
        </a>
        <a
          href="https://f-droid.org/repository/browse/?fdid=org.openobservatory.ooniprobe"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/static/images/fdroid-badge.svg"
            alt={intl.formatMessage({ id: 'Nettest.DownloadFdroid' })}
            height="56"
            width="189"
          />
        </a>
      </div>
    </div>
  )
}

export default CTA
