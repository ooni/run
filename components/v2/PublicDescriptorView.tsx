import { useMemo } from 'react'
import { Flex, Heading, Box } from 'ooni-components'
import { useIntl } from 'react-intl'
import useSWR from 'swr'
import { getList } from 'lib/api'
import useIcon from 'hooks/useIcon'
import NettestsBox from './NettestsBox'
import Revisions from './Revisions'
import DescriptorDetails from './DescriptorDetails'
import { formatMediumDateTime } from 'utils'

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
    <Box bg='#FFF' p={24}>
      <Heading h={4}>Link Content</Heading>
      <Flex flexDirection={['column', 'column', 'row']} sx={{gap: 4}}>
        <Box width={[1, 1, 1/2]}>
          <DescriptorDetails descriptor={descriptor} creationTime={creationTime} lastEditTime={lastEditTime} archived={archived} />
          <Box display={['none', 'none', 'block']} mt={4}><Revisions revisionsList={revisionsList} linkId={linkId} /></Box>
        </Box>
        <Box width={[1, 1, 1/2]}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
        <Box display={['block', 'block', 'none']}><Revisions revisionsList={revisionsList} linkId={linkId} /></Box>
      </Flex>
    </Box>
  )
}

export default PublicDescriptorDetails
