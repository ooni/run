import DescriptorIcon from "components/DescriptorIcon"
// import { differenceInDays } from "date-fns"
import Markdown from "markdown-to-jsx"
import { Box, Heading, Text } from "ooni-components"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import { formatMediumDate } from "utils"
import ArchivedTag from "../ArchivedTag"

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
    <Text as="span">
      {formatMessage(
        { id: "DescriptorDetails.ExpirationDate" },
        {
          date: expirationDate,
        },
      )}{" "}
    </Text>
  )
}

const DescriptorDetails = ({
  descriptor,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) => {
  const { locale, formatMessage } = useIntl()
  return (
    <>
      <Heading
        h={2}
        lineHeight={1}
        display="inline"
        verticalAlign="middle"
        mr={3}
      >
        {descriptor.icon && (
          <Box as="span" verticalAlign="text-bottom">
            <DescriptorIcon icon={descriptor.icon} />
          </Box>
        )}
        {descriptor.name}
      </Heading>

      {descriptor.is_expired && <ArchivedTag />}

      <Text fontSize={14} my={3}>
        {descriptor.author ? (
          <>
            {formatMessage(
              { id: "DescriptorDetails.CreatedByOn" },
              {
                author: <strong>{descriptor.author}</strong>,
                date: formatMediumDate(descriptor?.date_created, locale),
              },
            )}{" "}
          </>
        ) : (
          <>
            {formatMessage(
              { id: "DescriptorDetails.CreatedOn" },
              {
                date: formatMediumDate(descriptor?.date_created, locale),
              },
            )}{" "}
          </>
        )}
        {descriptor.date_updated && (
          <>
            {formatMessage(
              { id: "DescriptorDetails.LastUpdated" },
              {
                date: formatMediumDate(descriptor.date_updated, locale),
              },
            )}{" "}
          </>
        )}
        {descriptor.expiration_date && (
          <ExpirationDate expirationString={descriptor.expiration_date} />
        )}
      </Text>

      {descriptor.short_description && (
        <Text mb={3}>
          <Markdown>{descriptor.short_description}</Markdown>
        </Text>
      )}

      {descriptor.description && <Markdown>{descriptor.description}</Markdown>}
    </>
  )
}

export default DescriptorDetails
