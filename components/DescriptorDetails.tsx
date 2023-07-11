import { Container, Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { styled } from 'styled-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { FormattedMessage, useIntl } from 'react-intl'
import { BsTwitter } from 'react-icons/bs'

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

type DescriptorDetailsProps = {
  descriptor: Descriptor
  runLink: string
}

const DescriptorDetails = ({ descriptor, runLink }: DescriptorDetailsProps) => {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Heading h={1}>{descriptor.name}</Heading>
        </Box>
        <Flex>
          <Box pr={2}>
            <NLink href={runLink}>
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
          <ReactMarkdown>{descriptor.short_description}</ReactMarkdown>
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
        <ReactMarkdown>{descriptor.description}</ReactMarkdown>
      )}

      <Heading pt={4} pb={2} h={3}>
        <FormattedMessage
          id="Modal.Heading.ShareThisURL"
          defaultMessage="Share this link with OONI Probe mobile app users"
        />
      </Heading>
      <StyledCode>{runLink}</StyledCode>

      {/* {descriptor.icon && <p>{descriptor.icon}</p>} */}

      {/* {!!descriptor.description_intl?.length && (
        <p>
          {Object.entries(descriptor.description_intl).map(
            ([key, value]) => `${key}: ${value}`
          )}
        </p>
      )} */}
      <Heading h={4}>Nettests:</Heading>
      {descriptor.nettests.map((nettest) => (
        <>
          <p>Test name: {nettest.test_name}</p>
          <p>
            is_background_run_enabled:{' '}
            {nettest.is_background_run_enabled ? 'true' : 'false'}
          </p>
          <p>
            is_manual_run_enabled:{' '}
            {nettest.is_manual_run_enabled ? 'true' : 'false'}
          </p>
          {!!nettest.inputs?.length && (
            <>
              Inputs:
              {nettest.inputs.map((input: string, i: number) => (
                <p key={i}>{input}</p>
              ))}
            </>
          )}

          {!!nettest.options?.length && (
            <>
              Options:
              {Object.entries(nettest.options).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
              ))}
            </>
          )}
          {!!nettest.backend_options?.length && (
            <>
              Backend options:
              {Object.entries(nettest.backend_options).map(([key, value]) => (
                <p key={key}>{`${key}: ${value}`}</p>
              ))}
            </>
          )}
        </>
      ))}
    </>
  )
}

export default DescriptorDetails
