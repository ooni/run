import { Box, Flex, Heading } from "ooni-components"
import DescriptorDetails from "./DescriptorDetails"
import NettestsBox from "./NettestsBox"
import Revisions from "./Revisions"

const PublicDescriptorDetails = ({ descriptor, linkId }: DescriptorView) => {
  return (
    <Box bg="#FFF" p={24}>
      <Heading h={4}>Link Content</Heading>
      <Flex flexDirection={["column", "column", "row"]} sx={{ gap: 4 }}>
        <Box width={[1, 1, 1 / 2]}>
          <DescriptorDetails descriptor={descriptor} />
          <Box display={["none", "none", "block"]} mt={4}>
            <Revisions length={descriptor.revision} linkId={linkId} />
          </Box>
        </Box>
        <Box width={[1, 1, 1 / 2]}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
        <Box display={["block", "block", "none"]}>
          <Revisions length={descriptor.revision} linkId={linkId} />
        </Box>
      </Flex>
    </Box>
  )
}

export default PublicDescriptorDetails
