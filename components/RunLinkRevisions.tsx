import { Box, Button } from "ooni-components"
import useSWRMutation from 'swr/mutation'
import { getRunLink } from 'lib/api'


type RunLinkRevisionProps = {
  creationTime: string
  linkId: string
}

const RunLinkRevision = ({ creationTime, linkId }: RunLinkRevisionProps) => {
  const { trigger, data, error, isMutating } = useSWRMutation(
    [linkId, { creation_time: creationTime }],
    ([linkId, params]) => getRunLink(linkId, params),
    { throwOnError: false }
  )

  return (
    <Box mb={3}>
      <Box mb={1}>
        <Button
          variant="link"
          type="button"
          onClick={() => {
            trigger()
          }}
          sx={{ textDecoration: 'underline' }}
        >
          {new Intl.DateTimeFormat('en-US', {
            dateStyle: 'long',
            timeStyle: 'long',
            timeZone: 'UTC',
          }).format(new Date(creationTime))}
        </Button>
      </Box>
      {data && (
        <Box mb={3} bg="gray2" p={3}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Box>
      )}
      {error && (
        <Box mb={3} bg="gray2" p={3}>
          <pre>Error: {error.message}</pre>
        </Box>
      )}
    </Box>
  )
}

export default RunLinkRevision
