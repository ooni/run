import { Container, Heading, Text } from "ooni-components"

type Props = {
  reason: string
}

const Invalid = ({ reason }: Props) => (
  <>
    <Container>
      <Heading>Invalid request</Heading>
      <Text>The request is invalid: {reason || ""}</Text>
    </Container>
  </>
)
export default Invalid
