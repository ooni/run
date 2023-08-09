import OONIRunHero from 'components/OONIRunHero'
import { createRunLink, getRunLink } from 'lib/api'
import TestListForm from 'components/form/TestListForm'
import { Container } from 'ooni-components'
import { GetServerSidePropsContext } from 'next'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { transformOutgoingData } from 'pages/create'
import type { ParsedUrlQuery } from 'querystring'
import useUser from 'hooks/useUser'
import { generateRandomString } from 'utils'

const transformIntoArray = (obj: object) =>
  Object.entries(obj).map(([k, v]) => ({
    key: k,
    value: v,
  }))

const transformNettests = (nettest: any) => ({
  ...nettest,
  backend_options: transformIntoArray(nettest.backend_options),
  options: transformIntoArray(nettest.options),
})

const transformIncomingData = (formData: any) => {
  return {
    ...formData,
    name_intl: transformIntoArray(formData.name_intl),
    description_intl: transformIntoArray(formData.description_intl),
    short_description_intl: transformIntoArray(formData.short_description_intl),
    nettests: formData.nettests.map(transformNettests),
  }
}

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const { linkId } = params as QParams

  try {
    const runLink = await getRunLink(linkId, {
      nocache: generateRandomString(),
    })
    const descriptor = runLink.descriptor

    return {
      props: {
        runLink: transformIncomingData(descriptor),
      },
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }
}

type EditRunLinkProps = {
  runLink: {}
}

const EditRunLink = ({ runLink }: EditRunLinkProps) => {
  const {
    push,
    query: { linkId },
  } = useRouter()

  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) push('/')
  }, [user, loading])

  const onSubmit = useCallback((data: any) => {
    createRunLink(transformOutgoingData(data), { id: linkId }).then((res) => {
      push(`/view/${res.id}`)
    })
  }, [])

  return (
    <>
      <OONIRunHero href="/" />
      <Container>
        <TestListForm
          onSubmit={onSubmit}
          defaultValues={runLink}
          linkId={linkId as string}
        />
      </Container>
    </>
  )
}

export default EditRunLink
