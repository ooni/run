import { useMemo } from 'react'
import { Flex, Heading, Box, Button, Text } from 'ooni-components'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { getList } from 'lib/api'
import { BsTwitter } from 'react-icons/bs'
import useIcon from 'hooks/useIcon'
import NettestsBox from './NettestsBox'
import Revisions from './Revisions'
import DescriptorDetails from './DescriptorDetails'

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

const PublicDescriptorDetails = ({
  descriptor,
  descriptorCreationTime,
  archived,
  linkId,
}: DescriptorView) => {
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
    <Box bg='#FFF' p={4}>
      <Heading h={4}>Link Content</Heading>
      <Flex flexDirection={['column', 'column', 'row']}>
        <Box width={[1, 1, 1/2]}>
          <DescriptorDetails descriptor={descriptor} creationTime={creationTime} lastEditTime={lastEditTime} archived={archived} />
          <Revisions revisionsList={revisionsList} linkId={linkId} />
        </Box>
        <Box width={[1, 1, 1/2]}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
      </Flex>
    </Box>
  )
}

export default PublicDescriptorDetails
