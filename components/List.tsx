import { getList } from 'lib/api'
import { useMemo } from 'react'
import useSWR from 'swr'

import ListLoader from 'components/ListLoader'
import DescriptorCard from './DescriptorCard'

type ListProps = {
  limit?: number
  queryParams?: {}
}
const List = ({ limit, queryParams }: ListProps) => {
  const { data, error, isLoading } = useSWR<{ descriptors: Descriptor[] }>(
    { only_latest: true, ...queryParams },
    (props: {}) => getList(props)
  )

  const descriptors = useMemo(
    () => (limit ? data?.descriptors.slice(0, limit) : data?.descriptors),
    [data]
  )
  
  return (
    <>
      {isLoading && <ListLoader />}
      {descriptors?.map((desc) => (
        <DescriptorCard descriptor={desc} key={desc.ooni_run_link_id} />
      ))}
    </>
  )
}

export default List
