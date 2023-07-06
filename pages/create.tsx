import type { NextPage } from 'next'

import { useCallback } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Container, Button, Flex, Box } from 'ooni-components'

import { createRunLink } from 'lib/api'
import OONIRunHero from '../components/OONIRunHero'

import { useRouter } from 'next/router'
import TestListForm from 'components/form/TestListForm'

const StyleLinkButton = styled(Button)`
  text-transform: none;
`

const GraphicsWithGradient = styled(Box)`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;

  svg {
    width: 100%;
  }

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(142, 219, 248, 0),
      rgba(63, 128, 162, 1)
    );
  }
`

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

  const onSubmit = useCallback((data: any) => {
    console.log('SUBMIT', data)
    createRunLink(transformOutgoingData(data)).then((res) => {
      router.push(`/view/${res.id}`)
    })
  }, [])

  return (
    <>
      <OONIRunHero href={'/'} />

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
    </>
  )
}

export default Create
