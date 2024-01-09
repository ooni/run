import { getList } from "lib/api"
import NLink from "next/link"
import { Box, Button, Flex, Heading, Text } from "ooni-components"
import { useMemo } from "react"
import { BsTwitter } from "react-icons/bs"
import { FormattedMessage, useIntl } from "react-intl"
import useSWR from "swr"

import { formatMediumDateTime } from "utils"
import Code from "../Code"
import DescriptorDetails from "./DescriptorDetails"
import NettestsBox from "./NettestsBox"
import Revisions from "./Revisions"

type TwitterButtonProps = { universalLink: string }

const TwitterButton = ({ universalLink }: TwitterButtonProps) => {
  const intl = useIntl()

  const message = encodeURIComponent(
    intl.formatMessage({
      id: "Share.Twitter.Tweet",
      defaultMessage: "Run OONI Probe to test for censorship!",
    }),
  )
  const url = encodeURIComponent(universalLink)
  const tweetUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`

  return (
    <a href={tweetUrl} target="_blank" rel="noreferrer">
      <Button hollow size="small">
        <Text mr={2}>
          {intl.formatMessage({
            id: "Share.Twitter.Button",
            defaultMessage: "Tweet",
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
      <Flex
        justifyContent="space-between"
        flexDirection={["column-reverse", "column-reverse", "row"]}
      >
        <Heading h={4}>Link Info</Heading>

        {!archived && (
          <Flex
            alignItems="start"
            justifyContent="end"
            sx={{ gap: 2 }}
            flexWrap="wrap"
          >
            <NLink href={`/edit/${linkId}`}>
              <Button hollow size="small">
                Edit
              </Button>
            </NLink>
            {deepLink && (
              <NLink href={deepLink}>
                <Button hollow size="small">
                  <FormattedMessage
                    id="Modal.Button.Link"
                    defaultMessage="Link"
                  />
                </Button>
              </NLink>
            )}
            <TwitterButton universalLink={runLink} />
          </Flex>
        )}
      </Flex>

      <DescriptorDetails
        descriptor={descriptor}
        creationTime={creationTime}
        lastEditTime={lastEditTime}
        archived={archived}
      />

      {!archived && (
        <Box p={3} my={4} sx={{ border: "1px solid", borderColor: "blue5" }}>
          <Heading mb={2} mt={0} h={3}>
            <FormattedMessage id="Modal.Heading.ShareThisURL" />
          </Heading>
          <Code text={runLink} />
        </Box>
      )}

      <Box mt={4}>
        <NettestsBox nettests={descriptor.nettests} />
      </Box>

      <Box mt={4}>
        <Revisions revisionsList={revisionsList} linkId={linkId} />
      </Box>
    </>
  )
}

export default DescriptorView
