import { Box, Button, Heading, Link, Text } from "ooni-components"
import { FormattedMessage } from "react-intl"

import Image from "next/image"

type CTAProps = {
  linkTitle: string
  deepLink: string
  installLink: string
}

const CTA = ({ linkTitle, deepLink, installLink }: CTAProps) => {
  return (
    <Box bg="#FFF" p={24} sx={{ border: "1px solid", borderColor: "primary" }}>
      <Heading h={2}>{linkTitle}</Heading>
      <Heading pt={2} h={3}>
        <FormattedMessage id="Nettest.Heading.HaveMobileApp" />
      </Heading>
      <Text pt={2} pb={3}>
        <FormattedMessage
          id="Nettest.Text.HaveMobileApp"
          defaultMessage="Tap Run and open this link with your OONI Probe mobile app to start the test."
        />
      </Text>

      <Link href={deepLink}>
        <Button>
          <FormattedMessage id="Nettest.Button.Run" defaultMessage="Run" />
        </Button>
      </Link>

      <Heading pt={4} h={3}>
        <FormattedMessage id="Nettest.Heading.InstallApp" />
      </Heading>
      <Text pt={2} pb={3}>
        <FormattedMessage
          id="Nettest.Text.InstallApp"
          defaultMessage="Currently, OONI Run links only work with the OONI Probe mobile app."
        />
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
              alt="Download ooniprobe for Android"
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
              alt="Download ooniprobe for iOS"
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
              alt="Download ooniprobe for Android (F-Droid)"
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
