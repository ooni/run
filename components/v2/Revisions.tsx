import NLink from "next/link"
import { Box, Heading } from "ooni-components"
import { useIntl } from "react-intl"
import styled from "styled-components"

const StyledLink = styled(NLink)`
text-decoration: underline;
`

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Revisions = ({ length, linkId }: any) => {
  const intl = useIntl()
  const revisionsLength = length - 1

  return (
    <>
      {!!revisionsLength && (
        <>
          <Heading h={4}>
            {intl.formatMessage({ id: "Revisions.Title" })}
          </Heading>
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
