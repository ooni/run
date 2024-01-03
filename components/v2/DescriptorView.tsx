import { useMemo } from 'react'
import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import NLink from 'next/link'
import { FormattedMessage, useIntl } from 'react-intl'
import useSWR from 'swr'
import { getList } from 'lib/api'
import { BsTwitter } from 'react-icons/bs'

import Code from '../Code'
import NettestsBox from './NettestsBox'
import Revisions from './Revisions'
import DescriptorDetails from './DescriptorDetails'
import { formatMediumDateTime } from 'utils'

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

const DescriptorView = ({
  descriptor,
  descriptorCreationTime,
  archived,
  runLink,
  deepLink,
  linkId,
}: DescriptorView) => {
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
        <Heading h={4}>Link Info</Heading>
          
        {!archived && (
          <Flex alignItems="start">
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
    
            <TwitterButton universalLink={runLink} />
          </Flex>
        )}
      </Flex>

      <DescriptorDetails descriptor={descriptor} creationTime={creationTime} lastEditTime={lastEditTime} archived={archived} />

      {!archived  && (
        <Box p={3} my={4} sx={{border: '1px solid', borderColor: 'blue5'}}>
          <Heading mb={2} mt={0} h={3}>
            <FormattedMessage id="Modal.Heading.ShareThisURL" />
          </Heading>
          <Code text={runLink} />
        </Box>
      )}

      <NettestsBox nettests={descriptor.nettests} />
      <Box mt={4}>
        <Revisions revisionsList={revisionsList} linkId={linkId} />
      </Box>
    </>
  )
}

export default DescriptorView
