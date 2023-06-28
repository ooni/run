import OONIRunHero from 'components/OONIRunHero'
import { createRunLink, getRunLink } from 'lib/api'
import TestListForm from 'components/form/TestListForm'
import { Container } from 'ooni-components'
import { GetServerSideProps } from 'next'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { transformOutgoingData } from 'pages'
import type { ParsedUrlQuery } from 'querystring'

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

export const getServerSideProps: GetServerSideProps<{ runLink: {} }> = async ({
  params,
}) => {
  const { linkId } = params as QParams
  const runLink = await getRunLink(linkId)

  return {
    props: {
      runLink: transformIncomingData(runLink.descriptor),
    },
  }
}

type EditRunLinkProps = {
  runLink: {}
}

const EditRunLink = ({ runLink }: EditRunLinkProps) => {
  console.log('transformOutgoingData', runLink)
  const {
    push,
    query: { linkId },
  } = useRouter()

  const onSubmit = useCallback((data: any) => {
    console.log('SUBMIT', data)
    createRunLink(transformOutgoingData(data), { id: linkId }).then((res) => {
      push(`/view/${res.id}`)
    })
  }, [])

  return (
    <>
      <OONIRunHero href="/" />
      <Container>
        <TestListForm onSubmit={onSubmit} defaultValues={runLink} />
      </Container>
    </>
  )
}

export default EditRunLink
