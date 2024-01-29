import DescriptorIcon from "components/DescriptorIcon"
import { differenceInDays } from "date-fns"
import Markdown from "markdown-to-jsx"
import { Box, Heading, Text } from "ooni-components"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import { formatMediumDateTime } from "utils"
import ArchivedTag from "../ArchivedTag"

type ExpirationDateProps = {
  expirationString: string
}
const ExpirationDate = ({ expirationString }: ExpirationDateProps) => {
  const { locale } = useIntl()

  const dateDifference = differenceInDays(
    new Date(expirationString),
    new Date(),
  )
  const warningColor = dateDifference < 7
  const expirationDate = useMemo(
    () => formatMediumDateTime(expirationString, locale),
    [expirationString, locale],
  )

  return (
    <Text as="span" color={warningColor && "red5"}>
      Expiration date {expirationDate}
    </Text>
  )
}

const DescriptorDetails = ({
  descriptor,
  creationTime,
  lastEditTime,
  archived,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) => {
  const { locale } = useIntl()
  console.log("descriptor", descriptor)

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

      {archived && <ArchivedTag />}

      <Text fontSize={14} my={3}>
        {descriptor.author ? (
          <>
            Created by <strong>{descriptor.author}</strong> on {creationTime}.
          </>
        ) : (
          <>Created on {creationTime}. </>
        )}
        {lastEditTime && <>Last updated {lastEditTime}. </>}
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
