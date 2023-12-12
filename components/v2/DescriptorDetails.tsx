import { Heading, Box, Text } from "ooni-components"
import Markdown from 'markdown-to-jsx'
import useIcon from 'hooks/useIcon'
import ArchivedTag from '../ArchivedTag'

const DescriptorDetails = ({ descriptor, creationTime, lastEditTime, archived } : any) => {
  const icon = useIcon(descriptor.icon)

  return (
    <>
      <Heading h={2} lineHeight={1} display='inline' verticalAlign='middle' mr={3}>
        <Box as='span' verticalAlign='text-bottom'>{icon}</Box>
        {descriptor.name}
      </Heading>
      {archived && <ArchivedTag />}
      {descriptor.author && (
        <Text fontSize={14} mb={3}>
          Created by <strong>{descriptor.author}</strong> on {creationTime}. {lastEditTime && <>Last updated {lastEditTime}.</>}
        </Text>
      )}

      {descriptor.short_description && (
        <Text mb={3}>
          <Markdown>{descriptor.short_description}</Markdown>
        </Text>
      )}

      {descriptor.description && (
        <Markdown>{descriptor.description}</Markdown>
      )}
    </>
  )
}

export default DescriptorDetails