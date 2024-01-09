import { getList } from "lib/api"
import { Box, Container, Heading } from "ooni-components"
import { useMemo } from "react"
import { useIntl } from "react-intl"
import useSWR from "swr"

import NLink from "next/link"
import styled from "styled-components"
import { formatMediumDateTime } from "utils"
import DescriptorDetails from "../v2/DescriptorDetails"
import NettestsBox from "../v2/NettestsBox"

const StyledToast = styled(Box)`
a {
  color: white;
  text-decoration: underline;
  &:hover {
    color: white;
  }
}
`

const RevisionView = ({
  descriptor,
  descriptorCreationTime,
  archived,
  linkId,
}: RevisionView) => {
  const { locale } = useIntl()

  const { data: listData } = useSWR({ ooni_run_link_id: linkId }, (props) =>
    getList(props),
  )

  const revisionsList = useMemo(() => {
    if (listData?.descriptors?.length > 1) {
      // biome-ignore lint/correctness/noUnsafeOptionalChaining: <explanation>
      const listCopy = [...listData?.descriptors]
      listCopy.reverse().shift()
      return listCopy
    }
    return []
  }, [listData])

  const [creationTime, lastEditTime] = useMemo(() => {
    return revisionsList.length
      ? [
          revisionsList[revisionsList.length - 1].descriptor_creation_time,
          descriptorCreationTime,
        ].map((r) => formatMediumDateTime(r, locale))
      : [formatMediumDateTime(descriptorCreationTime, locale), null]
  }, [revisionsList, descriptorCreationTime, locale])

  return (
    <>
      <StyledToast bg="red9" color="white" textAlign="center" p={3}>
        This is a revision from{" "}
        {new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
          timeStyle: "medium",
          timeZone: "UTC",
        }).format(new Date(descriptorCreationTime))}
        . Back to <NLink href={`/v2/${linkId}`}>current link</NLink>.
      </StyledToast>
      <Container p={4}>
        <Heading h={4}>Link Info</Heading>
        <DescriptorDetails
          descriptor={descriptor}
          creationTime={creationTime}
          lastEditTime={lastEditTime}
          archived={archived}
        />
        <Box mt={4}>
          <NettestsBox nettests={descriptor.nettests} />
        </Box>
      </Container>
    </>
  )
}

export default RevisionView
