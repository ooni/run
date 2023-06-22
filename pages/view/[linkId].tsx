import OONIRunHero from 'components/OONIRunHero'
import { getRunLink } from 'lib/api'
import { GetServerSideProps } from 'next'
import { Container, Box, Heading } from 'ooni-components'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

export const getServerSideProps: GetServerSideProps = async ({
  query: { linkId },
}) => {
  const runLink = await getRunLink(linkId)

  return {
    props: {
      descriptor: runLink.descriptor,
    },
  }
}

type ViewRunLinkProps = {
  descriptor: {}
}

const ViewRunLink = ({ descriptor }: ViewRunLinkProps) => {
  return (
    <>
      <OONIRunHero href="/" />
      <Container>
        <Heading h={2}>{descriptor.name}</Heading>
        {/* <p>{descriptor.name_intl}</p> */}
        <ReactMarkdown>{descriptor.short_description}</ReactMarkdown>
        {/* <p>{descriptor.short_description_intl}</p> */}
        <p>created by {descriptor.author}</p>
        <p>{descriptor.icon}</p>
        <ReactMarkdown>{descriptor.description}</ReactMarkdown>
        {/* <p>{descriptor.description_intl}</p> */}
        <Heading h={4}>Nettests:</Heading>
        {descriptor.nettests.map((nettest) => (
          <>
            <p>{nettest.test_name}</p>
            <p>
              is_background_run_enabled:{' '}
              {nettest.is_background_run_enabled ? 'true' : 'false'}
            </p>
            <p>
              is_manual_run_enabled:{' '}
              {nettest.is_manual_run_enabled ? 'true' : 'false'}
            </p>
            {!!nettest.inputs?.length &&
              nettest.inputs.map((input: string) => <p>{input}</p>)}
            {/* <p>{nettest.options}</p>
            <p>{nettest.backend_options}</p> */}
          </>
        ))}
        {/* <Box mt={3}>{JSON.stringify(descriptor)}</Box> */}
      </Container>
    </>
  )
}

export default ViewRunLink
