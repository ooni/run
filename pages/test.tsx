import { GetServerSideProps } from "next"
import { Container } from "ooni-components"

const useragent = require("useragent/index.js")

type Props = {
  userAgent: string | undefined
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
  const ua = useragent.parse(userAgent)

  const props: Props = {
    userAgent,
  }

  return { props }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Test = ({ userAgent }: any) => {
  return (
    <Container mt={3}>
      <p>{userAgent}</p>
      <a href="intent://runv2/159682723702#Intent;package=org.openobservatory.ooniprobe;scheme=ooni;end;">
        intent://runv2/159682723702#Intent;package=org.openobservatory.ooniprobe;scheme=ooni;end;
      </a>
      <br />
      <a href="intent://runv2/159682723702#Intent;package=org.openobservatory.ooniprobe;scheme=ooni;S.browser_fallback_url=https://run.test.ooni.org;end;">
        intent://runv2/159682723702#Intent;package=org.openobservatory.ooniprobe;scheme=ooni;S.browser_fallback_url=https://run.test.ooni.org;end;
      </a>
      <br />
      <a href="https://run.test.ooni.org/v2/159682723702">
        https://run.test.ooni.org/v2/159682723702
      </a>
    </Container>
  )
}

export default Test
