import { Box} from "ooni-components"
import NLink from "next/link"


type RunLinkRevisionProps = {
  creationTime: string
  linkId: string
}

const RunLinkRevision = ({ creationTime, linkId }: RunLinkRevisionProps) => {


  return (
    <Box mb={3}>
      <NLink href={`/revisions/${linkId}?datetime=${creationTime}`}>
        {new Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
          timeStyle: 'long',
          timeZone: 'UTC',
        }).format(new Date(creationTime))}
        </NLink>
    </Box>
  )
}

export default RunLinkRevision
