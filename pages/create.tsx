import type { NextPage } from 'next'

import { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Container, Flex, Box } from 'ooni-components'

import { createRunLink } from 'lib/api'
import OONIRunHero from '../components/OONIRunHero'

import { useRouter } from 'next/router'
import TestListForm from 'components/form/TestListForm'
import useUser from 'hooks/useUser'

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
  const formData = data.ooniRunLink[0]
  return {
    ...formData,
    name_intl: transformIntoObject(formData.name_intl),
    description_intl: transformIntoObject(formData.description_intl),
    short_description_intl: transformIntoObject(
      formData.short_description_intl
    ),
    nettests: formData.nettests.map(transformNettests),
  }
}

const Create: NextPage = () => {
  const router = useRouter()
  const { loading, user } = useUser()

  useEffect(() => {
    if (!user && !loading) router.push('/')
  }, [user, loading])

  const onSubmit = useCallback((data: any) => {
    createRunLink(transformOutgoingData(data)).then((res) => {
      router.push(`/view/${res.id}`)
    })
  }, [])

  return (
    <>
      <OONIRunHero href={'/'} />

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
              <TestListForm onSubmit={onSubmit} />
            </Box>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default Create
