import { Box, Container, Heading } from "ooni-components"

import Revisions from "components/v2/Revisions"
import NLink from "next/link"
import type { ReactNode } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"
import DescriptorDetails from "../v2/DescriptorDetails"
import NettestsBox from "../v2/NettestsBox"

const StyledToast = styled(Box)`
a {
  color: white;
  text-decoration: underline;
  &:hover {
    color: white;
  }
}
`

const RevisionView = ({ descriptor, linkId }: RevisionView) => {
  const intl = useIntl()
  const revisionDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(descriptor.date_created))

  return (
    <>
      <StyledToast bg="red9" color="white" textAlign="center" p={3}>
        {intl.formatMessage(
          { id: "RevisionView.TopNotice" },
          {
            date: revisionDate,
            link: (str: ReactNode) => (
              <NLink href={`/v2/${linkId}`}>{str}</NLink>
            ),
          },
        )}
      </StyledToast>
      <Container p={[3, 4]}>
        <Heading h={4}>
          {intl.formatMessage({ id: "RevisionView.LinkInfo" })}
        </Heading>
        <DescriptorDetails descriptor={descriptor} />
        <Box mt={4}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
        <Box mt={4}>
          <Revisions length={descriptor.revision} linkId={linkId} />
        </Box>
      </Container>
    </>
  )
}

export default RevisionView
