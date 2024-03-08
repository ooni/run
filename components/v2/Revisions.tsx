import NLink from "next/link"
import { Box, Heading } from "ooni-components"
import styled from "styled-components"

const StyledLink = styled(NLink)`
text-decoration: underline;
`

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Revisions = ({ length, linkId }: any) => {
  const revisionsLength = length - 1

  return (
    <>
      {!!revisionsLength && (
        <>
          <Heading h={4}>Previous revisions</Heading>
          {[...Array(revisionsLength).keys()].reverse().map((i) => (
            <Box mb={3} key={i}>
              <StyledLink href={`/revisions/${linkId}?revision=${i + 1}`}>
                v{i + 1}
              </StyledLink>
            </Box>
          ))}
        </>
      )}
    </>
  )
}

export default Revisions
