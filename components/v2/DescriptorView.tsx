// import { formatDuration, intervalToDuration } from "date-fns"
import NLink from "next/link"
import { Box, Button, Flex, Heading } from "ooni-components"
import { useMemo, type ReactNode } from "react"
import { BsTwitter } from "react-icons/bs"
import { MdOpenInNew } from "react-icons/md"
import { FormattedMessage, useIntl } from "react-intl"
import { formatMediumDateTime } from "utils"
import Code from "../Code"
import DescriptorDetails from "./DescriptorDetails"
import NettestsBox from "./NettestsBox"
import Revisions from "./Revisions"

type ExpirationBoxProps = {
  expirationString: string
  linkId: string
}

const ExpirationBox = ({ expirationString, linkId }: ExpirationBoxProps) => {
  const { locale, formatMessage } = useIntl()

  // const dateDifference = formatDuration(
  //   intervalToDuration({
  //     start: new Date(),
  //     end: new Date(expirationString),
  //   }),
  //   {
  //     format: ["years", "months", "days", "hours", "minutes"],
  //     delimiter: ", ",
  //   },
  // )

  const expirationDate = useMemo(
    () => formatMediumDateTime(expirationString, locale),
    [expirationString, locale],
  )

  return (
    <Flex
      p={4}
      my={4}
      sx={{
        borderColor: "red9",
        borderStyle: "solid",
        borderWidth: "2px",
        borderRadius: "8px",
        color: "red9",
        gap: 3,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Box suppressHydrationWarning={true}>
        {formatMessage(
          { id: "DescriptorDetails.ExpirationNotice" },
          {
            date: expirationDate,

          },
        )}
        <NLink href={`/edit/${linkId}`}>
          <Button
            size="small"
            mx={3}
            sx={{ backgroundColor: "red9", borderColor: "red9" }}
          >
            {formatMessage({ id: 'DescriptorDetails.UpdateButton' })}
          </Button>
        </NLink>
      </Box>
    </Flex>
  )
}

type TwitterButtonProps = { universalLink: string }

const TwitterButton = ({ universalLink }: TwitterButtonProps) => {
  const intl = useIntl()

  const message = encodeURIComponent(
    intl.formatMessage({
      id: "Share.Twitter.Tweet",
    }),
  )
  const url = encodeURIComponent(universalLink)
  const tweetUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`

  return (
    <a href={tweetUrl} target="_blank" rel="noreferrer">
      <Button hollow size="small" endIcon={<BsTwitter />}>
        {intl.formatMessage({
          id: "Share.Twitter.Button",
        })}
      </Button>
    </a>
  )
}

const DescriptorView = ({
  descriptor,
  runLink,
  deepLink,
  linkId,
  userAgent,
}: DescriptorView) => {
  const intl = useIntl()
  const isMobile = useMemo(() => {
    if (userAgent) {
      const uaFamily = JSON.parse(userAgent).family
      return uaFamily === "iOS" || uaFamily === "Android"
    }
    return false
  }, [userAgent])

  return (
    <>
      <Flex
        justifyContent="space-between"
        flexDirection={["column-reverse", "column-reverse", "row"]}
      >
        <Heading h={4}>
          {intl.formatMessage({ id: "RevisionView.LinkInfo" })}
        </Heading>

        {!descriptor.is_expired && (
          <Flex
            alignItems="start"
            justifyContent="end"
            sx={{ gap: 2 }}
            flexWrap="wrap"
          >
            <NLink href={`/edit/${linkId}`}>
              <Button hollow size="small">
                {intl.formatMessage({ id: "General.Edit" })}
              </Button>
            </NLink>
            {deepLink && isMobile && (
              <NLink href={deepLink}>
                <Button hollow size="small" endIcon={<MdOpenInNew />}>
                  <FormattedMessage id="Modal.Button.Link" />
                </Button>
              </NLink>
            )}
            <TwitterButton universalLink={runLink} />
          </Flex>
        )}
      </Flex>

      <DescriptorDetails descriptor={descriptor} />

      {descriptor?.expiration_date && !descriptor.is_expired && (
        <ExpirationBox
          expirationString={descriptor?.expiration_date}
          linkId={linkId}
        />
      )}

      {!descriptor.is_expired && (
        <Box
          p={3}
          my={4}
          sx={{
            border: "1px solid",
            borderColor: "blue5",
            borderRadius: "8px",
          }}
        >
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
        <Revisions length={descriptor.revision} linkId={linkId} />
      </Box>
    </>
  )
}

export default DescriptorView
