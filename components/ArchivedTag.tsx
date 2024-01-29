import { Box, Flex } from "ooni-components"
import { MdOutlineInventory2 } from "react-icons/md"
import { styled } from "styled-components"

const StyledArchivedTag = styled(Flex)`
border-radius: 4px;
text-transform: uppercase;
letter-spacing: 1.25px;
}`

const ArchivedTag = () => {
  return (
    <Box sx={{ display: "inline-block" }}>
      <StyledArchivedTag
        bg="gray6"
        color="white"
        fontSize={0}
        lineHeight={1.2}
        fontWeight="600"
        px={2}
        py={1}
        alignItems="center"
      >
        <span>EXPIRED</span>
        <MdOutlineInventory2 />
      </StyledArchivedTag>
    </Box>
  )
}

export default ArchivedTag
