import useIcon from "hooks/useIcon"
import Markdown from "markdown-to-jsx"
import { Box, Heading, Text } from "ooni-components"
import ArchivedTag from "../ArchivedTag"

const DescriptorDetails = ({
  descriptor,
  creationTime,
  lastEditTime,
  archived,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) => {
  const icon = useIcon(descriptor.icon)

  return (
    <>
      <Heading
        h={2}
        lineHeight={1}
        display="inline"
        verticalAlign="middle"
        mr={3}
      >
        <Box as="span" verticalAlign="text-bottom">
          {icon}
        </Box>
        {descriptor.name}
      </Heading>

      {archived && <ArchivedTag />}

      <Text fontSize={14} my={3}>
        {descriptor.author ? (
          <>
            Created by <strong>{descriptor.author}</strong> on {creationTime}.{" "}
            {lastEditTime && <>Last updated {lastEditTime}.</>}
          </>
        ) : (
          <>
            Created on {creationTime}.{" "}
            {lastEditTime && <>Last updated {lastEditTime}.</>}
          </>
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
