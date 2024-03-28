import { Box, Container, Heading } from "ooni-components"

import NLink from "next/link"
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
  return (
    <>
      <StyledToast bg="red9" color="white" textAlign="center" p={3}>
        This is a revision from{" "}
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
          timeStyle: "medium",
          timeZone: "UTC",
        }).format(new Date(descriptor.date_created))}
        . Back to <NLink href={`/v2/${linkId}`}>current link</NLink>.
      </StyledToast>
      <Container p={[3, 4]}>
        <Heading h={4}>Link Info</Heading>
        <DescriptorDetails descriptor={descriptor} />
        <Box mt={4}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
      </Container>
    </>
  )
}

export default RevisionView
