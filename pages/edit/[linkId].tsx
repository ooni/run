import { createRunLink, getRunLink, getUserEmail } from 'lib/api'
import TestListForm from 'components/form/TestListForm'
import { Container } from 'ooni-components'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { transformOutgoingData } from 'pages/create'
import type { ParsedUrlQuery } from 'querystring'
import useUser from 'hooks/useUser'
import { generateRandomString } from 'utils'
import useSWR from 'swr'
import OONIRunHero from 'components/OONIRunHero'

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
    color: formData?.color ? formData.color :  '#000000',
    author: formData?.author || getUserEmail(),
    include_author: formData?.author ? true : false,
    name_intl: transformIntoArray(formData.name_intl),
    description_intl: transformIntoArray(formData.description_intl),
    short_description_intl: transformIntoArray(formData.short_description_intl),
    nettests: formData.nettests.map(transformNettests),
  }
}

// interface QParams extends ParsedUrlQuery {
//   linkId: string
// }

// export const getServerSideProps = async ({
//   params,
// }: GetServerSidePropsContext) => {
//   const { linkId } = params as QParams

//   try {
//     const runLink = await getRunLink(linkId, {
//       nocache: generateRandomString(),
//     })
//     const descriptor = runLink.descriptor

//     return {
//       props: {
//         runLink: transformIncomingData(descriptor),
//       },
//     }
//   } catch (e) {
//     return {
//       redirect: {
//         destination: '/',
//       },
//     }
//   }
// }

// type EditRunLinkProps = {
//   runLink: {}
// }

const EditRunLink = () => {
  const {
    push,
    query: { linkId },
  } = useRouter()

  const [randString] = useState(generateRandomString())

  const { loading, user } = useUser()
  const isAdmin = useMemo(() => (user?.role === 'admin'), [user])

  const { data, error, isLoading } = useSWR(
    user ? [linkId, { nocache: randString }] : null,
    ([linkId, params]) => getRunLink(linkId as string, params)
  )

  const runLink = useMemo(() => {
    return data?.descriptor ? transformIncomingData(data?.descriptor) : null
  }, [data])

  useEffect(() => {
    if (!user && !loading) push('/')
  }, [user, loading, push])

  const onSubmit = useCallback((data: any) => {
    createRunLink(transformOutgoingData(data), { ooni_run_link_id: linkId }).then((res) => {
      push(`/v2/${res.ooni_run_link_id}`)
    })
  }, [])

  return (
    <>
      <OONIRunHero />
      <Container>
        {runLink && (
          <TestListForm
            isAdmin={isAdmin}
            onSubmit={onSubmit}
            defaultValues={runLink}
            linkId={linkId as string}
          />
        )}
      </Container>
    </>
  )
}

export default EditRunLink
