import Markdown from "markdown-to-jsx"
import NLink from "next/link"
import { Box, Heading, Text } from "ooni-components"
import { MdKeyboardArrowRight } from "react-icons/md"
import { useIntl } from "react-intl"
import styled from "styled-components"
import { formatMediumDateTime } from "utils"
import { icons } from "utils/icons"
import ArchivedTag from "./ArchivedTag"
import DescriptorIcon from "./DescriptorIcon"

type Span = {
  children: React.ReactNode
}
const Span = ({ children }: Span) => <span>{children}</span>

const StyledLink = styled(NLink)`
  display: flex;
  justify-content: space-between;
  color: black;
  line-height: 1.3;
  background: #FFF;
  padding: ${(props) => props.theme.space[3]}px;
  border: 1px solid ${(props) => props.theme.colors.gray3};
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  &:hover {
    color: ${(props) => props.theme.colors.blue5};
  }
`

type DescriptorCard = {
  descriptor: Descriptor
}

const DescriptorCard = ({ descriptor }: DescriptorCard) => {
  const { locale } = useIntl()

  return (
    <StyledLink href={`/v2/${descriptor.oonirun_link_id}`}>
      <Box alignSelf="start">
        <Box mb={1}>
          <Heading h={4} m={0} display="inline" mr={2}>
            {descriptor?.icon && (
              <Box as="span" verticalAlign="text-top">
                <DescriptorIcon icon={descriptor.icon as keyof typeof icons} />
              </Box>
            )}
            {descriptor.name}
          </Heading>
          {!!descriptor.is_expired && (
            <Box as="span" verticalAlign="super">
              <ArchivedTag />
            </Box>
          )}
        </Box>
        <Text mb={2}>
          {descriptor.author && (
            <Text as="span">
              Created by{" "}
              <Text as="span" fontWeight="bold">
                {descriptor.author}
              </Text>{" "}
              |{" "}
            </Text>
          )}{" "}
          Updated {formatMediumDateTime(descriptor.date_updated, locale)} |{" "}
          {descriptor.is_expired ? "Expired" : "Expiring"}{" "}
          {formatMediumDateTime(descriptor.expiration_date, locale)}
        </Text>
        {descriptor.short_description && (
          <Text color="gray5">
            <Markdown
              options={{
                overrides: {
                  a: {
                    component: Span,
                  },
                },
              }}
            >
              {descriptor.short_description}
            </Markdown>
          </Text>
        )}
      </Box>
      <Box alignSelf="center">
        <MdKeyboardArrowRight />
      </Box>
    </StyledLink>
  )
}

export default DescriptorCard
