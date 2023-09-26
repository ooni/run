import { useMemo } from 'react'
import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { styled } from 'styled-components'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import { MdOutlineContentCopy } from 'react-icons/md'
import { getList } from 'lib/api'
import { BsTwitter } from 'react-icons/bs'
import useIcon from 'hooks/useIcon'
import ArchivedTag from './ArchivedTag'
import RunLinkRevision from './RunLinkRevisions'

export const formatMediumDateTime = (date: string, locale: string) => (
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
)

const StyledCode = styled(Box)`
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
      <Button hollow btnSize='small'>
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
  descriptorCreationTime,
  archived,
  runLink,
  deepLink,
  linkId,
}: DescriptorDetails) => {
  const icon = useIcon(descriptor.icon)
  const { locale } = useIntl()

  const { data: listData } = useSWR({ ids: linkId }, (props) => getList(props))

  const revisionsList = useMemo(() => {
    if (listData?.descriptors?.length > 1) {
      const listCopy = [...listData?.descriptors]
      listCopy.reverse().shift()
      return listCopy
    } else {
      return []
    }
  }, [listData])

  const [creationTime, lastEditTime] = useMemo(() => {
    return revisionsList.length ?
      [revisionsList[revisionsList.length - 1].descriptor_creation_time, descriptorCreationTime].map((r) => formatMediumDateTime(r, locale)) :
      [formatMediumDateTime(descriptorCreationTime, locale), null]
  }, [revisionsList, descriptorCreationTime])

  return (
    <>
      <Flex
        justifyContent="space-between"
        // flexDirection={['column-reverse', 'column-reverse', 'row']}
      >
        <Box mb={3}>
          <Heading h={1} lineHeight={1} display='inline' verticalAlign='middle' mr={3}>
            <Box as='span' verticalAlign='middle'>{icon}</Box>
            {descriptor.name}
          </Heading>
          {archived && <ArchivedTag />}
        </Box>
        {!archived && (
          <Flex alignItems="start">
            <Box pr={2}>
              <NLink href={deepLink}>
                <StyleLinkButton hollow btnSize='small'>
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
        <Text fontSize={14} mb={3}>
          Created by <strong>{descriptor.author}</strong> on {creationTime}. {lastEditTime && <>Last updated {lastEditTime}.</>}
        </Text>
      )}

      {/* {!!Object.entries(descriptor.name_intl).length && (
        <>
          {Object.entries(descriptor.name_intl).map(
            ([key, value]) => <p key={key}>{`${key}: ${value}`}</p>
          )}
        </>
      )} */}
      {descriptor.short_description && (
        <Text mb={3}>
          <Markdown>{descriptor.short_description}</Markdown>
        </Text>
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
          <Heading pt={3} pb={2} h={3}>
            <FormattedMessage
              id="Modal.Heading.ShareThisURL"
              defaultMessage="Share this link with OONI Probe mobile app users"
            />
          </Heading>
          <StyledCode bg='gray2'>{runLink} <MdOutlineContentCopy style={{verticalAlign: 'middle'}} /></StyledCode>
        </Box>
      )}

      {/* {!!descriptor.description_intl?.length && (
        <p>
          {Object.entries(descriptor.description_intl).map(
            ([key, value]) => `${key}: ${value}`
          )}
        </p>
      )} */}
      <Heading h={4}>Tests</Heading>

      {descriptor.nettests.map((nettest, i) => (
        <Flex flexDirection='column' key={`${nettest.test_name}-${i}`} mb={3} p={3} sx={{border: '1px solid', borderColor: 'gray3', borderRadius: 8}}>
          <Text fontWeight={600}>{nettest.test_name}</Text>

          {/* <StyledRow>
            <StyledRowName>is_background_run_enabled:</StyledRowName>
            <Box>{nettest.is_background_run_enabled ? 'true' : 'false'}</Box>
          </StyledRow>
          <StyledRow>
            <StyledRowName>is_manual_run_enabled:</StyledRowName>
            <Box>{nettest.is_manual_run_enabled ? 'true' : 'false'}</Box>
          </StyledRow> */}

          {!!nettest.inputs?.length && (
            <>
              <Text fontSize={0} fontWeight={600} mt={3} mb={2}>INPUTS ({nettest.inputs.length})</Text>
              <Text fontSize={14}>
                {/* {nettest.inputs.map((input: string, i: number) => (
                  <p key={i}>{input}</p>
                ))} */}
                {nettest.inputs.join(', ')}
              </Text>
            </>
          )}
{/* 
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
          )} */}
          
        </Flex>
      ))}
      {!!revisionsList.length && (
        <>
          <Heading h={4}>Previous revisions</Heading>
          {revisionsList.map((item: any) => (
            <RunLinkRevision
              key={item.descriptor_creation_time}
              linkId={linkId}
              creationTime={item.descriptor_creation_time}
            />
          ))}
        </>
      )}
    </>
  )
}

export default DescriptorDetails
