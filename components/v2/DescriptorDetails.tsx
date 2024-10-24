import DescriptorIcon from 'components/DescriptorIcon'
// import { differenceInDays } from "date-fns"
import Markdown from 'markdown-to-jsx'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { formatMediumDate } from 'utils'
import ArchivedTag from '../ArchivedTag'

type ExpirationDateProps = {
  expirationString: string
}
const ExpirationDate = ({ expirationString }: ExpirationDateProps) => {
  const { locale, formatMessage } = useIntl()

  // const dateDifference = differenceInDays(
  //   new Date(expirationString),
  //   new Date(),
  // )
  // const warningColor = dateDifference < 14 && dateDifference > 0
  const expirationDate = useMemo(
    () => formatMediumDate(expirationString, locale),
    [expirationString, locale],
  )

  return (
    // <Text as="span" color={warningColor && "red5"}>
    <span>
      {formatMessage(
        { id: 'DescriptorDetails.ExpirationDate' },
        {
          date: expirationDate,
        },
      )}{' '}
    </span>
  )
}

const DescriptorDetails = ({
  descriptor,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) => {
  const { locale, formatMessage } = useIntl()
  return (
    <>
      <h2 className="leading-none inline align-middle mr-4">
        {descriptor.icon && (
          <span className="align-text-bottom">
            <DescriptorIcon icon={descriptor.icon} />
          </span>
        )}
        {descriptor.name}
      </h2>

      {descriptor.is_expired && <ArchivedTag />}

      <div className="text-sm my-4">
        {descriptor.author ? (
          <>
            {formatMessage(
              { id: 'DescriptorDetails.CreatedByOn' },
              {
                author: <strong>{descriptor.author}</strong>,
                date: formatMediumDate(descriptor?.date_created, locale),
              },
            )}{' '}
          </>
        ) : (
          <>
            {formatMessage(
              { id: 'DescriptorDetails.CreatedOn' },
              {
                date: formatMediumDate(descriptor?.date_created, locale),
              },
            )}{' '}
          </>
        )}
        {descriptor.date_updated && (
          <>
            {formatMessage(
              { id: 'DescriptorDetails.LastUpdated' },
              {
                date: formatMediumDate(descriptor.date_updated, locale),
              },
            )}{' '}
          </>
        )}
        {descriptor.expiration_date && (
          <ExpirationDate expirationString={descriptor.expiration_date} />
        )}
      </div>

      {descriptor.short_description && (
        <div className="mb-4">
          <Markdown>{descriptor.short_description}</Markdown>
        </div>
      )}

      {descriptor.description && <Markdown>{descriptor.description}</Markdown>}
    </>
  )
}

export default DescriptorDetails
