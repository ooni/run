import { Box, Button, Heading, Link, Text } from "ooni-components"
import { FormattedMessage, useIntl } from "react-intl"

import Image from "next/image"

type CTAProps = {
  linkTitle: string
  deepLink: string
}

const CTA = ({ linkTitle, deepLink }: CTAProps) => {
  const intl = useIntl()
  return (
    <Box bg="#FFF" p={24} sx={{ border: "1px solid", borderColor: "primary" }}>
      <Heading h={2}>{linkTitle}</Heading>
      <Heading pt={2} h={3}>
        <FormattedMessage id="Nettest.Heading.HaveMobileApp" />
      </Heading>
      <Text pt={2} pb={3}>
        <FormattedMessage id="Nettest.Text.HaveMobileApp" />
      </Text>

      <Link href={deepLink}>
        <Button>
          <FormattedMessage id="Nettest.Button.Run" />
        </Button>
      </Link>

      <Heading pt={4} h={3}>
        <FormattedMessage id="Nettest.Heading.InstallApp" />
      </Heading>
      <Text pt={2} pb={3}>
        <FormattedMessage id="Nettest.Text.InstallApp" />
      </Text>

      <Box>
        <Box as="span" mr={3}>
          <a
            href="https://play.google.com/store/apps/details?id=org.openobservatory.ooniprobe"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/static/images/google-play-badge.svg"
              alt={intl.formatMessage({ id: "Nettest.DownloadAndroid" })}
              height="56"
              width="189"
            />
          </a>
        </Box>
        <Box as="span" mr={3}>
          <a
            href="https://itunes.apple.com/us/app/id1199566366"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/static/images/apple-store-badge.svg"
              alt={intl.formatMessage({ id: "Nettest.DownloadIOS" })}
              height="56"
              width="168"
            />
          </a>
        </Box>
        <Box as="span" mr={3}>
          <a
            href="https://f-droid.org/repository/browse/?fdid=org.openobservatory.ooniprobe"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/static/images/fdroid-badge.svg"
              alt={intl.formatMessage({ id: "Nettest.DownloadFdroid" })}
              height="56"
              width="189"
            />
          </a>
        </Box>
      </Box>
    </Box>
  )
}

export default CTA
