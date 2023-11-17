import { useMemo } from 'react'
import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { styled } from 'styled-components'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import { getList } from 'lib/api'
import { BsTwitter } from 'react-icons/bs'
import useIcon from 'hooks/useIcon'
import ArchivedTag from './ArchivedTag'
import RunLinkRevision from './RunLinkRevisions'
import Code from './Code'

export const formatMediumDateTime = (date: string, locale: string) => (
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
)

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
      <Button hollow size='small'>
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

  const { data: listData } = useSWR({ ooni_run_link_id: linkId }, (props) => getList(props))

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
        flexDirection={['column-reverse', 'column-reverse', 'row']}
      >
        <Box mb={3}>
          <Heading h={4}>Link Info</Heading>
          <Heading h={1} lineHeight={1} display='inline' verticalAlign='middle' mr={3}>
            <Box as='span' verticalAlign='middle'>{icon}</Box>
            {descriptor.name}
          </Heading>
          {archived && <ArchivedTag />}
        </Box>
        {!archived && (
          <Flex alignItems="start">
            <Box pr={2}>
              <NLink href={`/edit/${linkId}`}>
                <StyleLinkButton hollow size='small'>
                  Edit
                </StyleLinkButton>
              </NLink>
              <NLink href={deepLink}>
                <StyleLinkButton hollow size='small'>
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

      {descriptor.short_description && (
        <Text mb={3}>
          <Markdown>{descriptor.short_description}</Markdown>
        </Text>
      )}

      {descriptor.description && (
        <Markdown>{descriptor.description}</Markdown>
      )}

      {!archived && (
        <Box p={3} my={4} sx={{border: '1px solid', borderColor: 'blue5'}}>
          <Heading mb={2} mt={0} h={3}>
            <FormattedMessage id="Modal.Heading.ShareThisURL" />
          </Heading>
          <Code text={runLink} />
        </Box>
      )}

      <Box p={3} sx={{border: '1px solid', borderColor: 'gray3', borderRadius: 8}}>
        <Heading h={4}>Tests</Heading>
        {descriptor.nettests.map((nettest, i) => (
          <Flex flexDirection='column' key={`${nettest.test_name}-${i}`} mb={3}>
            <Text fontWeight={600}>{nettest.test_name}</Text>

            {!!nettest.inputs?.length && (
              <>
                <Text fontSize={0} fontWeight={600} mt={3} mb={2}>INPUTS ({nettest.inputs.length})</Text>
                <Text fontSize={14}>
                  {nettest.inputs.join(', ')}
                </Text>
              </>
            )}
            
          </Flex>
        ))}
      </Box>
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
