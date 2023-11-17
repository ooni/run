import type { NextPage } from 'next'

import { useCallback, useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Container, Flex, Box } from 'ooni-components'

import { createRunLink } from 'lib/api'

import { useRouter } from 'next/router'
import TestListForm from 'components/form/TestListForm'
import useUser from 'hooks/useUser'
import OONIRunHero from 'components/OONIRunHero'

const transformKeyValue = ({ key, value }: any) => ({ [key]: value })

const transformIntoObject = (arrObj: any) =>
  arrObj.map(transformKeyValue).reduce((result: {}, current: {}) => {
    return Object.assign(result, current)
  }, {})

const transformNettests = (nettest: any) => ({
  ...nettest,
  backend_options: transformIntoObject(nettest.backend_options),
  options: transformIntoObject(nettest.options),
})

export const transformOutgoingData = (data: any) => {
  const { include_author, author, ...formData } = data.ooniRunLink[0]
  return {
    ...formData,
    name_intl: transformIntoObject(formData.name_intl),
    description_intl: transformIntoObject(formData.description_intl),
    short_description_intl: transformIntoObject(
      formData.short_description_intl
    ),
    nettests: formData.nettests.map(transformNettests),
    // only include author's email if they opted in
    author: include_author ? author : null
  }
}

const Create: NextPage = () => {
  const router = useRouter()
  const { loading, user } = useUser()
  const isAdmin = useMemo(() => (user?.role === 'admin'), [user])

  useEffect(() => {
    if (!user && !loading) router.push('/')
  }, [user, loading])

  const onSubmit = useCallback((data: any) => {
    createRunLink(transformOutgoingData(data)).then((res) => {
      router.push(`/v2/${res.ooni_run_link_id}`)
    })
  }, [])

  // const onSubmit = () =>
  //   new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 2000)
  //   })

  return (
    <>
      <OONIRunHero />
      {!user || loading ? (
        <></>
      ) : (
        <Container pt={4} maxWidth={800}>
          <Flex justifyContent="center">
            <Box width={[1, 1, 3 / 4]}>
              <FormattedMessage
                tagName={Text}
                id="WhatCanYouDoText.WebCensorship"
                defaultMessage='Add websites below that you would like to test for censorship. Click "Generate" to create a link based on those websites. Share that link with OONI Probe mobile app users so that they can test the websites of your choice!'
              />
              <TestListForm isAdmin={isAdmin} onSubmit={onSubmit} />
            </Box>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default Create
