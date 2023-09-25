import { Button, Box, Text, Heading, Flex } from 'ooni-components'
import NLink from 'next/link'
import styled from 'styled-components'
import Markdown from 'markdown-to-jsx'
import useIcon from 'hooks/useIcon'
import { useRouter } from 'next/router'
import ArchivedTag from './ArchivedTag'
import { MdKeyboardArrowRight } from 'react-icons/md'

const StyledFlex = styled(Flex)`
  border: 1px solid ${(props) => props.theme.colors.gray3};
  border-radius: 8px;
  margin-bottom: ${(props) => props.theme.space[3]}px;
  cursor: pointer;
  position: relative;
  &:hover {
    .h4 {
      color: ${(props) => props.theme.colors.blue5};
    }
  }
`
type DescriptorCard = {
  descriptor: Descriptor
}

const DescriptorCard = ({ descriptor }: DescriptorCard) => {
  const router = useRouter()
  const icon = useIcon(descriptor.icon)

  const redirectToViewPage = () => router.push(`/view/${descriptor.id}`)

  return (
    <StyledFlex alignItems='center' p={3}  flexDirection={['column', 'column', 'row']} lineHeight={1.3} onClick={redirectToViewPage}>
      <Box width={[1, 1, 3/5]}>
        <Box mb={1} alignItems='center'>
          <Box display='inline-block' fontSize={2} verticalAlign='middle'>{icon}</Box>
          <Heading h={4} m={0} display='inline-block' mr={2}>{descriptor.name}</Heading>
          {!!descriptor.archived && <Box as='span' verticalAlign='super'><ArchivedTag /></Box>}
        </Box>
        <Text mb={2}>Created by <Text as='span' fontWeight='bold'>{descriptor.author}</Text></Text>
        {descriptor.short_description && 
          <Text color='gray5'>
            <Markdown>{descriptor.short_description}</Markdown>
          </Text>
        }
      </Box>
      <Flex width={[1, 1, 2/5]} pr={[0, 4]}  mt={[3, 3, 0]} justifyContent={['start', 'start', 'end']} sx={{ gap: 3 }}>
        <NLink href={`/view/${descriptor.id}`}>
          <Button type="button" hollow btnSize='small'>
            View
          </Button>
        </NLink>
        {!!descriptor.mine && (
          <NLink href={`/edit/${descriptor.id}`}>
            <Button type="button" hollow btnSize='small'>
              Edit
            </Button>
          </NLink>
        )}
      </Flex>
      <Box sx={{position: 'absolute', right:'16px', top: '44%'}}><MdKeyboardArrowRight /></Box>
    </StyledFlex>
  )
}

export default DescriptorCard