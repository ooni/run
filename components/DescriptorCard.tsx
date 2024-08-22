import Markdown from 'markdown-to-jsx'
import Link, { type LinkProps } from 'next/link'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useIntl } from 'react-intl'
import { formatMediumDate } from 'utils'
import type { icons } from 'utils/icons'
import ArchivedTag from './ArchivedTag'
import DescriptorIcon from './DescriptorIcon'

type Span = {
  children: React.ReactNode
}
const Span = ({ children }: Span) => <span>{children}</span>

// type StyledLink = {
//   href: string
// }
const StyledLink = ({ href, ...props }: LinkProps) => (
  <Link
    href={href}
    {...props}
    className="flex justify-between text-black leading-[1.3] bg-white p-4 border border-gray-300 rounded-lg cursor-pointer relative hover:text-blue-500"
  />
)

type DescriptorCard = {
  descriptor: Descriptor
}

const DescriptorCard = ({ descriptor }: DescriptorCard) => {
  const { locale, formatMessage } = useIntl()

  return (
    <StyledLink href={`/v2/${descriptor.oonirun_link_id}`}>
      <div className="self-start">
        <div className="mb-1">
          <h4 className="m-0 inline mr-2">
            {descriptor?.icon && (
              <DescriptorIcon icon={descriptor.icon as keyof typeof icons} />
            )}
            {descriptor.name}
          </h4>
          {!!descriptor.is_expired && (
            <span className="align-text-bottom">
              <ArchivedTag />
            </span>
          )}
        </div>
        <div className="mb-2">
          {descriptor.author && (
            <span>
              {formatMessage(
                { id: 'DescriptorCard.CreatedBy' },
                {
                  author: (
                    <span className="font-bold">{descriptor.author}</span>
                  ),
                },
              )}{' '}
              |{' '}
            </span>
          )}{' '}
          {formatMessage(
            { id: 'DescriptorCard.Updated' },
            { date: formatMediumDate(descriptor.date_updated, locale) },
          )}{' '}
          |{' '}
          {descriptor.is_expired
            ? formatMessage(
                { id: 'DescriptorCard.Expired' },
                { date: formatMediumDate(descriptor.expiration_date, locale) },
              )
            : formatMessage(
                { id: 'DescriptorCard.Expiring' },
                { date: formatMediumDate(descriptor.expiration_date, locale) },
              )}
        </div>
        {descriptor.short_description && (
          <div className="text-gray-500">
            <Markdown
              options={{
                overrides: {
                  a: {
                    component: Span,
                  },
                },
              }}
            >
              {descriptor.short_description}
            </Markdown>
          </div>
        )}
      </div>
      <div className="self-center">
        <MdKeyboardArrowRight />
      </div>
    </StyledLink>
  )
}

export default DescriptorCard
