import OONIRunHero from 'components/OONIRunHero'
import { getRunLink } from 'lib/api'
import { GetServerSideProps } from 'next'
import NLink from 'next/link'
import {
  Container,
  Box,
  Heading,
  Flex,
  Link,
  Button,
  Text,
  Input,
} from 'ooni-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import type { ParsedUrlQuery } from 'querystring'
import { FormattedMessage, useIntl } from 'react-intl'
import { BsTwitter } from 'react-icons/bs'
import { styled } from 'styled-components'

type Nettest = {
  test_name: string
  inputs: string[]
  options: {}[]
  backend_options: {}[]
  is_background_run_enabled: boolean
  is_manual_run_enabled: boolean
}

type Descriptor = {
  id: string
  name: string
  name_intl: {}[]
  author: string | undefined
  icon: string | undefined
  short_description: string | undefined
  short_description_intl: {}[]
  archived: boolean
  description: string | undefined
  description_intl: {}[]
  nettests: Nettest[]
}

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps: GetServerSideProps<{
  descriptor: Descriptor
}> = async ({ params }) => {
  const { linkId } = params as QParams
  const runLink = await getRunLink(linkId)

  return {
    props: {
      descriptor: runLink.descriptor,
      linkId,
    },
  }
}

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

const StyledCode = styled.code`
  background-color: #eee;
  border-radius: 3px;
  font-family: courier, monospace;
  padding: 14px;
  white-space: pre-wrap;
  display: block;
`

type ViewRunLinkProps = {
  descriptor: Descriptor
  linkId: number
}

const ViewRunLink = ({ descriptor, linkId }: ViewRunLinkProps) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : undefined
  const runLink = `${baseUrl}/v2/${linkId}`

  return (
    <>
      <OONIRunHero href="/" />
      <Container py={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box><Heading h={1}>{descriptor.name}</Heading></Box>
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
        
        {!!descriptor.name_intl?.length && (
          <p>
            {Object.entries(descriptor.name_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
        {descriptor.short_description && (
          <Heading h={5}>
            <ReactMarkdown>{descriptor.short_description}</ReactMarkdown>
          </Heading>
        )}
        {!!descriptor.short_description_intl?.length && (
          <p>
            {Object.entries(descriptor.short_description_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
        
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
        
        {!!descriptor.description_intl?.length && (
          <p>
            {Object.entries(descriptor.description_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
        <Heading h={4}>Nettests:</Heading>
        {descriptor.nettests.map((nettest) => (
          <>
            <p>{nettest.test_name}</p>
            <p>
              is_background_run_enabled:{' '}
              {nettest.is_background_run_enabled ? 'true' : 'false'}
            </p>
            <p>
              is_manual_run_enabled:{' '}
              {nettest.is_manual_run_enabled ? 'true' : 'false'}
            </p>
            {!!nettest.inputs?.length &&
              nettest.inputs.map((input: string, i: number) => (
                <p key={i}>{input}</p>
              ))}
            {!!nettest.options?.length && (
              <p>
                {Object.entries(nettest.options).map(
                  ([key, value]) => `${key}: ${value}`
                )}
              </p>
            )}
            {!!nettest.backend_options?.length && (
              <p>
                {Object.entries(nettest.backend_options).map(
                  ([key, value]) => `${key}: ${value}`
                )}
              </p>
            )}
          </>
        ))}
      </Container>
    </>
  )
}

export default ViewRunLink
