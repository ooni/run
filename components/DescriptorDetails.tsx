import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { styled } from 'styled-components'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import { BsTwitter } from 'react-icons/bs'
import useIcon from 'hooks/useIcon'
import ArchivedTag from './ArchivedTag'

const StyledCode = styled.code`
  background-color: #eee;
  border-radius: 3px;
  font-family: courier, monospace;
  padding: 14px;
  white-space: pre-wrap;
  display: block;
`

const StyleLinkButton = styled(Button)`
  text-transform: none;
`

type TwitterButtonProps = { universalLink: string }

const TwitterButton = ({ universalLink }: TwitterButtonProps) => {
  const intl = useIntl()

  const message = encodeURIComponent(
    intl.formatMessage({
      id: 'Share.Twitter.Tweet',
      defaultMessage: 'Run OONI Probe to test for censorship!',
    })
  )
  const url = encodeURIComponent(universalLink)
  const tweetUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`

  return (
    <a href={tweetUrl} target="_blank">
      <Button>
        <Flex alignContent="center">
          <Text mr={2}>
            {intl.formatMessage({
              id: 'Share.Twitter.Button',
              defaultMessage: 'Tweet',
            })}
          </Text>
          <BsTwitter />
        </Flex>
      </Button>
    </a>
  )
}

const StyledRow = styled(Flex)`
  padding: 8px 0px;
  &:nth-child(odd) {
    background: ${(props) => props.theme.colors.gray0};
  }
  border-bottom: 1px solid ${(props) => props.theme.colors.gray2};
`

const StyledRowName = styled(Box).attrs({
  fontWeight: '600',
  width: [1, 1 / 3],
})``

const DescriptorDetails = ({
  descriptor,
  archived,
  runLink,
  deepLink,
}: DescriptorDetails) => {
  const icon = useIcon(descriptor.icon)

  return (
    <>
      {archived && <ArchivedTag />}
      <Flex
        justifyContent="space-between"
        flexDirection={['column-reverse', 'column-reverse', 'row']}
      >
        <Box>
          <Heading h={1} sx={{ display: 'flex', alignItems: 'center' }}>
            {icon} {descriptor.name}
          </Heading>
        </Box>
        {!archived && (
          <Flex alignItems="center">
            <Box pr={2}>
              <NLink href={deepLink}>
                <StyleLinkButton>
                  <FormattedMessage
                    id="Modal.Button.Link"
                    defaultMessage="Link"
                  />
                </StyleLinkButton>
              </NLink>
            </Box>
            <Box>
              <TwitterButton universalLink={runLink} />
            </Box>
          </Flex>
        )}
      </Flex>
      {descriptor.author && (
        <p>
          created by <strong>{descriptor.author}</strong>
        </p>
      )}

      {/* {!!Object.entries(descriptor.name_intl).length && (
        <>
          {Object.entries(descriptor.name_intl).map(
            ([key, value]) => <p key={key}>{`${key}: ${value}`}</p>
          )}
        </>
      )} */}
      {descriptor.short_description && (
        <Heading h={5}>
          <Markdown>{descriptor.short_description}</Markdown>
        </Heading>
      )}
      {/* {!!descriptor.short_description_intl?.length && (
        <p>
          {Object.entries(descriptor.short_description_intl).map(
            ([key, value]) => `${key}: ${value}`
          )}
        </p>
      )} */}

      {descriptor.description && (
        <Markdown>{descriptor.description}</Markdown>
      )}

      {!archived && (
        <Box mb={4}>
          <Heading pt={4} pb={2} h={3}>
            <FormattedMessage
              id="Modal.Heading.ShareThisURL"
              defaultMessage="Share this link with OONI Probe mobile app users"
            />
          </Heading>
          <StyledCode>{runLink}</StyledCode>
        </Box>
      )}

      {/* {!!descriptor.description_intl?.length && (
        <p>
          {Object.entries(descriptor.description_intl).map(
            ([key, value]) => `${key}: ${value}`
          )}
        </p>
      )} */}
      <Heading h={4}>Nettests:</Heading>

      {descriptor.nettests.map((nettest, i) => (
        <Flex flexDirection="column" key={`${nettest.test_name}-${i}`} mb={4}>
          <StyledRow>
            <StyledRowName>Test name:</StyledRowName>
            <Box>{nettest.test_name}</Box>
          </StyledRow>
          <StyledRow>
            <StyledRowName>is_background_run_enabled:</StyledRowName>
            <Box>{nettest.is_background_run_enabled ? 'true' : 'false'}</Box>
          </StyledRow>
          <StyledRow>
            <StyledRowName>is_manual_run_enabled:</StyledRowName>
            <Box>{nettest.is_manual_run_enabled ? 'true' : 'false'}</Box>
          </StyledRow>

          {!!nettest.inputs?.length && (
            <StyledRow>
              <StyledRowName>Inputs:</StyledRowName>
              <Box>
                {nettest.inputs.map((input: string, i: number) => (
                  <p key={i}>{input}</p>
                ))}
              </Box>
            </StyledRow>
          )}

          {!!nettest.options?.length && (
            <StyledRow>
              <StyledRowName>Options:</StyledRowName>
              <Box>
                {Object.entries(nettest.options).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
              </Box>
            </StyledRow>
          )}
          {!!nettest.backend_options?.length && (
            <StyledRow>
              <StyledRowName>Backend options:</StyledRowName>
              <Box>
                {Object.entries(nettest.backend_options).map(([key, value]) => (
                  <p key={key}>{`${key}: ${value}`}</p>
                ))}
              </Box>
            </StyledRow>
          )}
        </Flex>
      ))}
    </>
  )
}

export default DescriptorDetails
