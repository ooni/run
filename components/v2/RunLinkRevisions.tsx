import NLink from "next/link"
import { Box } from "ooni-components"
import styled from "styled-components"

const StyledLink = styled(NLink)`
text-decoration: underline;
`

type RunLinkRevisionProps = {
  creationTime: string
  linkId: string
}

const RunLinkRevision = ({ creationTime, linkId }: RunLinkRevisionProps) => {
  return (
    <Box mb={3}>
      <StyledLink href={`/revisions/${linkId}?datetime=${creationTime}`}>
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
          timeStyle: "long",
          timeZone: "UTC",
        }).format(new Date(creationTime))}
      </StyledLink>
    </Box>
  )
}

export default RunLinkRevision
