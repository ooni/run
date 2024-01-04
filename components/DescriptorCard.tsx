import { Box, Text, Heading, Flex } from 'ooni-components'
import styled from 'styled-components'
import Markdown from 'markdown-to-jsx'
import useIcon from 'hooks/useIcon'
import { useRouter } from 'next/router'
import ArchivedTag from './ArchivedTag'
import { MdKeyboardArrowRight } from 'react-icons/md'
import NLink from 'next/link'
import { useIntl } from 'react-intl'

const StyledFlex = styled(Flex)`
  border: 1px solid ${(props) => props.theme.colors.gray3};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  &:hover {
    h4 {
      color: ${(props) => props.theme.colors.blue5};
    }
  }
`

type DescriptorCard = {
  descriptor: Descriptor
}

const DescriptorCard = ({ descriptor }: DescriptorCard) => {
  const intl = useIntl()
  const icon = useIcon(descriptor.icon)

  return (
    <NLink href={`/v2/${descriptor.ooni_run_link_id}`}>
      <StyledFlex
        alignItems='center'
        justifyContent='space-between'
        p={3}
        bg='#FFF'
        lineHeight={1.3}
        color="black"
      >
        <Box>
          <Box mb={1}>
            <Heading h={4} m={0} display='inline' mr={2}><Box as='span' verticalAlign='text-top'>{icon}</Box>{descriptor.name}</Heading>
            {!!descriptor.archived && <Box as='span' verticalAlign='super'><ArchivedTag /></Box>}
          </Box>
          <Text mb={2}>
            {descriptor.author && 
              <Text as='span'>Created by <Text as='span' fontWeight='bold'>{descriptor.author}</Text> | </Text>
            } Last updated {new Intl.DateTimeFormat(intl.locale, { dateStyle: 'medium' }).format(new Date(descriptor.descriptor_creation_time))}
          </Text>
          {descriptor.short_description && 
            <Text color='gray5'>
              <Markdown>{descriptor.short_description}</Markdown>
            </Text>
          }
        </Box>
        <MdKeyboardArrowRight />
      </StyledFlex>
    </NLink>
  )
}

export default DescriptorCard