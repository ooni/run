import type { NextPage } from "next"

import { Box, Container, Flex, Text } from "ooni-components"
import { useCallback, useEffect, useMemo } from "react"
import { FormattedMessage } from "react-intl"

import TestListForm from "components/form/TestListForm"
import SpinLoader from "components/vendor/SpinLoader"
import useUser from "hooks/useUser"
import { createRunLink, getUserEmail } from "lib/api"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const transformKeyValue = ({ key, value }: any) => ({ [key]: value })

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const transformIntoObject = (arrObj: any) =>
  arrObj.map(transformKeyValue).reduce((result: object, current: object) => {
    return Object.assign(result, current)
  }, {})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const transformNettests = (nettest: any) => ({
  ...nettest,
  backend_options: transformIntoObject(nettest.backend_options),
  options: transformIntoObject(nettest.options),
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const transformOutgoingData = (data: any) => {
  const { include_author, author, ...formData } = data.ooniRunLink[0]
  return {
    ...formData,
    name_intl: transformIntoObject(formData.name_intl),
    description_intl: transformIntoObject(formData.description_intl),
    short_description_intl: transformIntoObject(
      formData.short_description_intl,
    ),
    nettests: formData.nettests.map(transformNettests),
    // only include author's email if they opted in
    author: include_author ? author : "",
  }
}

const defaultValues = {
  name: "",
  short_description: "",
  description: "",
  icon: "",
  color: "#000000",
  author: getUserEmail(),
  include_author: true,
  expiration_date: "",
  nettests: [
    {
      test_name: "web_connectivity",
      inputs: [],
      options: [],
      backend_options: [],
      is_background_run_enabled: false,
      is_manual_run_enabled: false,
    },
  ],
}

const Create: NextPage = () => {
  const router = useRouter()
  const { loading, user } = useUser()
  const isAdmin = useMemo(() => user?.role === "admin", [user])

  useEffect(() => {
    if (!user && !loading) router.push("/")
  }, [user, loading, router])

  const onSubmit = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (data: any) => {
      // console.log("transformOutgoingData(data)", transformOutgoingData(data))
      createRunLink(transformOutgoingData(data)).then((res) => {
        router.push(`/v2/${res.ooni_run_link_id}`)
      })
    },
    [router],
  )

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
        <Flex p={6} justifyItems="center" alignItems="center">
          <SpinLoader />
        </Flex>
      ) : (
        <Container pt={4} maxWidth={800}>
          <Flex justifyContent="center">
            <Box width={[1, 1, 3 / 4]}>
              <FormattedMessage
                tagName={Text}
                id="WhatCanYouDoText.WebCensorship"
                defaultMessage='Add websites below that you would like to test for censorship. Click "Generate" to create a link based on those websites. Share that link with OONI Probe mobile app users so that they can test the websites of your choice!'
              />
              <TestListForm
                isAdmin={isAdmin}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
              />
            </Box>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default Create
