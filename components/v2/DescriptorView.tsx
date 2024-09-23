// import { formatDuration, intervalToDuration } from "date-fns"
import NLink from 'next/link'
import { useMemo, type ReactNode } from 'react'
import { BsTwitter } from 'react-icons/bs'
import { MdOpenInNew } from 'react-icons/md'
import { FormattedMessage, useIntl } from 'react-intl'
import { formatMediumDateTime } from 'utils'
import Code from '../Code'
import DescriptorDetails from './DescriptorDetails'
import NettestsBox from './NettestsBox'
import Revisions from './Revisions'

type ExpirationBoxProps = {
  expirationString: string
  linkId: string
}

const ExpirationBox = ({ expirationString, linkId }: ExpirationBoxProps) => {
  const { locale, formatMessage } = useIntl()

  // const dateDifference = formatDuration(
  //   intervalToDuration({
  //     start: new Date(),
  //     end: new Date(expirationString),
  //   }),
  //   {
  //     format: ["years", "months", "days", "hours", "minutes"],
  //     delimiter: ", ",
  //   },
  // )

  const expirationDate = useMemo(
    () => formatMediumDateTime(expirationString, locale),
    [expirationString, locale],
  )

  return (
    <div className="flex p-8 my-8 border-2 border-red-900 rounded-lg text-red-900 gap-4 items-center flex-wrap">
      <div suppressHydrationWarning={true}>
        {formatMessage(
          { id: 'DescriptorDetails.ExpirationNotice' },
          {
            date: expirationDate,
          },
        )}
      </div>
      <NLink href={`/edit/${linkId}`} className="inline-block">
        <button
          type="button"
          className="btn btn-sm inline-block bg-red-900 border-red-900 text-white"
        >
          {formatMessage({ id: 'DescriptorDetails.UpdateButton' })}
        </button>
      </NLink>
    </div>
  )
}

type TwitterButtonProps = { universalLink: string }

const TwitterButton = ({ universalLink }: TwitterButtonProps) => {
  const intl = useIntl()

  const message = encodeURIComponent(
    intl.formatMessage({
      id: 'Share.Twitter.Tweet',
    }),
  )
  const url = encodeURIComponent(universalLink)
  const tweetUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`

  return (
    <a href={tweetUrl} target="_blank" rel="noreferrer">
      <button className="btn btn-primary-hollow btn-sm" type="button">
        <span className="flex gap-1 items-center">
          {intl.formatMessage({
            id: 'Share.Twitter.Button',
          })}{' '}
          <BsTwitter />
        </span>
      </button>
    </a>
  )
}

const DescriptorView = ({
  descriptor,
  runLink,
  deepLink,
  linkId,
  userAgent,
}: DescriptorView) => {
  const intl = useIntl()
  const isMobile = useMemo(() => {
    if (userAgent) {
      const uaFamily = JSON.parse(userAgent).family
      return uaFamily === 'iOS' || uaFamily === 'Android'
    }
    return false
  }, [userAgent])

  return (
    <>
      <div className="flex justify-between flex-col-reverse lg:flex-row">
        <h4>{intl.formatMessage({ id: 'RevisionView.LinkInfo' })}</h4>

        {!descriptor.is_expired && (
          <div className="flex items-start justify-end gap-3 flex-wrap">
            <NLink href={`/edit/${linkId}`}>
              <button className="btn btn-primary-hollow btn-sm" type="button">
                {intl.formatMessage({ id: 'General.Edit' })}
              </button>
            </NLink>
            {deepLink && isMobile && (
              <NLink href={deepLink}>
                <button className="btn btn-primary-hollow btn-sm" type="button">
                  <span className="flex gap-1 items-center">
                    <FormattedMessage id="Modal.Button.Link" /> <MdOpenInNew />
                  </span>
                </button>
              </NLink>
            )}
            <TwitterButton universalLink={runLink} />
          </div>
        )}
      </div>

      <DescriptorDetails descriptor={descriptor} />

      {descriptor?.expiration_date && !descriptor.is_expired && (
        <ExpirationBox
          expirationString={descriptor?.expiration_date}
          linkId={linkId}
        />
      )}

      {!descriptor.is_expired && (
        <div className="p-4 my-8 border border-blue-500 rounded-lg">
          <h3 className="mb-2 mt-0">
            <FormattedMessage id="Modal.Heading.ShareThisURL" />
          </h3>
          <Code text={runLink} />
        </div>
      )}

      <div className="mt-8">
        <NettestsBox nettests={descriptor.nettests} />
      </div>

      <div className="mt-8">
        <Revisions length={descriptor.revision} linkId={linkId} />
      </div>
    </>
  )
}

export default DescriptorView
