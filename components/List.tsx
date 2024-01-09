import { getList } from "lib/api"
import { useMemo } from "react"
import useSWR from "swr"

import ListLoader from "components/ListLoader"
import { Box } from "ooni-components"
import { styled } from "styled-components"
import DescriptorCard from "./DescriptorCard"

const StyledGrid = styled(Box)`
display: grid;
grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
gap: 16px 24px;
`

type ListProps = {
  limit?: number
  queryParams?: object
}
const List = ({ queryParams }: ListProps) => {
  const { data, error, isLoading } = useSWR<{ descriptors: Descriptor[] }>(
    { only_latest: true, ...queryParams },
    (props: object) => getList(props),
  )

  const descriptors = useMemo(
    // archived links are shown at the end
    () =>
      data?.descriptors.sort(
        (a, b) => Number(a.archived) - Number(b.archived),
      ) || [],
    [data],
  )

  return (
    <>
      {isLoading && <ListLoader />}
      {!!descriptors.length && (
        <StyledGrid>
          {descriptors?.map((desc) => (
            <DescriptorCard descriptor={desc} key={desc.ooni_run_link_id} />
          ))}
        </StyledGrid>
      )}
    </>
  )
}

export default List
