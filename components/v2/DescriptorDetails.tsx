import { useMemo, cloneElement, ReactElement } from 'react'
import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import Markdown from 'markdown-to-jsx'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import { getList } from 'lib/api'
import { BsTwitter } from 'react-icons/bs'
import useIcon from 'hooks/useIcon'
import ArchivedTag from '../ArchivedTag'
import RunLinkRevision from './RunLinkRevisions'
import Code from '../Code'
import { testGroups, testNames } from 'utils/test-info'

export const formatMediumDateTime = (date: string, locale: string) => (
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
)

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
        <Text mr={2}>
          {intl.formatMessage({
            id: 'Share.Twitter.Button',
            defaultMessage: 'Tweet',
          })}
        </Text>
        <BsTwitter />
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
  // console.log("descriptor", descriptor)
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

  const getIconComponent = (icon: ReactElement | undefined) => (
    icon ? cloneElement(icon, {size: '20'}) : null
  )

  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection={['column-reverse', 'column-reverse', 'row']}
      >
        <Box mb={3}>
          <Heading h={4}>Link Info</Heading>
          <Heading h={2} lineHeight={1} display='inline' verticalAlign='middle' mr={3}>
            <Box as='span' verticalAlign='text-bottom'>{icon}</Box>
            {descriptor.name}
          </Heading>
          {archived && <ArchivedTag />}
        </Box>
        {!archived && runLink && (
          <Flex alignItems="start">
            {/* <Box pr={2}> */}
              <NLink href={`/edit/${linkId}`}>
                <Button mr={2} hollow size='small'>
                  Edit
                </Button>
              </NLink>
              {deepLink && <NLink href={deepLink}>
                <Button mr={2} hollow size='small'>
                  <FormattedMessage
                    id="Modal.Button.Link"
                    defaultMessage="Link"
                  />
                </Button>
              </NLink>}
            {/* </Box> */}
            {/* <Box> */}
              <TwitterButton universalLink={runLink} />
            {/* </Box> */}
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

      {!archived && runLink && (
        <Box p={3} my={4} sx={{border: '1px solid', borderColor: 'blue5'}}>
          <Heading mb={2} mt={0} h={3}>
            <FormattedMessage id="Modal.Heading.ShareThisURL" />
          </Heading>
          <Code text={runLink} />
        </Box>
      )}

      <Box p={3} mt={3} sx={{border: '1px solid', borderColor: 'gray3', borderRadius: 8}}>
        <Heading h={4} my={0}>Tests</Heading>
        {descriptor.nettests.map((nettest, i) => (
          <Flex key={`${nettest.test_name}-${i}`} flexDirection='column' pb={2} pt={2} sx={i > 0 ? {borderTop: '1px solid', borderColor: 'gray3'} : {}}>
            <Flex alignItems="center">
              <Box color={testGroups[testNames[nettest.test_name].group].color} mr={2}>
                {getIconComponent(testGroups[testNames[nettest.test_name].group].icon)}
              </Box>
              <Text fontWeight={600}>{testNames[nettest.test_name].name}</Text>
            </Flex>
            {!!nettest.inputs?.length && (
              <>
                <Text fontSize={0} fontWeight={600} mt={2} mb={2}>INPUTS ({nettest.inputs.length})</Text>
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
