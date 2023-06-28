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

type Nettest = {
  test_name: string
  inputs: string[]
  options: {}[]
  backend_options: {}[]
  is_background_run_enabled: boolean
  is_manual_run_enabled: boolean
}

type Descriptor = {
  descriptor: {
    id: string
    name: string
    name_intl: {}[]
    author: string | undefined
    icon: string | undefined
    short_description: string | undefined
    short_description_intl: {}[]
    archived: boolean
    description: string | undefined
    description_intl: {}[]
    nettests: Nettest[]
  }
}

const ViewRunLink = ({ descriptor }: Descriptor) => {
  return (
    <>
      <OONIRunHero href="/" />
      <Container>
        <Heading h={2}>{descriptor.name}</Heading>
        {!!descriptor.name_intl?.length && (
          <p>
            {Object.entries(descriptor.name_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
        {descriptor.short_description && (
          <ReactMarkdown>{descriptor.short_description}</ReactMarkdown>
        )}
        {!!descriptor.short_description_intl?.length && (
          <p>
            {Object.entries(descriptor.short_description_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
        {descriptor.author && <p>created by {descriptor.author}</p>}
        {descriptor.icon && <p>{descriptor.icon}</p>}
        {descriptor.description && (
          <ReactMarkdown>{descriptor.description}</ReactMarkdown>
        )}
        {!!descriptor.description_intl?.length && (
          <p>
            {Object.entries(descriptor.description_intl).map(
              ([key, value]) => `${key}: ${value}`
            )}
          </p>
        )}
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
              nettest.inputs.map((input: string, i: number) => (
                <p key={i}>{input}</p>
              ))}
            {!!nettest.options?.length && (
              <p>
                {Object.entries(nettest.options).map(
                  ([key, value]) => `${key}: ${value}`
                )}
              </p>
            )}
            {!!nettest.backend_options?.length && (
              <p>
                {Object.entries(nettest.backend_options).map(
                  ([key, value]) => `${key}: ${value}`
                )}
              </p>
            )}
          </>
        ))}
      </Container>
    </>
  )
}

export default ViewRunLink
