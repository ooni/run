import { Container, Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { styled } from 'styled-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { FormattedMessage, useIntl } from 'react-intl'
import { BsTwitter } from 'react-icons/bs'
import * as FAIcons from 'react-icons/fa6'
import { useMemo } from 'react'

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

const StyledArchivedTag = styled(Box)`
display: inline-block;
border-radius: 4px;
text-transform: uppercase;
letter-spacing: 1.25px;
}`

type DescriptorDetailsProps = {
  descriptor: Descriptor
  runLink: string
  deepLink: string
  archived: boolean | null
}

const DescriptorDetails = ({
  descriptor,
  archived,
  runLink,
  deepLink,
}: DescriptorDetailsProps) => {
  const icon = useMemo(() => {
    if (!!descriptor.icon && FAIcons[descriptor.icon as keyof typeof FAIcons]) {
      const Icon = FAIcons[descriptor.icon as keyof typeof FAIcons]
      return <Icon style={{ marginRight: '10px' }} />
    }
  }, [descriptor])

  return (
    <>
      {archived && (
        <StyledArchivedTag
          bg="red6"
          color="white"
          fontSize={14}
          fontWeight="bold"
          px={2}
          py={1}
        >
          ARCHIVED
        </StyledArchivedTag>
      )}
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

      {!archived && (
        <>
          <Heading pt={4} pb={2} h={3}>
            <FormattedMessage
              id="Modal.Heading.ShareThisURL"
              defaultMessage="Share this link with OONI Probe mobile app users"
            />
          </Heading>
          <StyledCode>{runLink}</StyledCode>
        </>
      )}

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
