import type { NextPage } from "next"

import { Box, Container, Flex, Text } from "ooni-components"
import { useEffect, useMemo } from "react"
import { FormattedMessage } from "react-intl"

import TestListForm from "components/form/TestListForm"
import SpinLoader from "components/vendor/SpinLoader"
import useUser from "hooks/useUser"
import { createRunLink, getUserEmail } from "lib/api"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import useSWRMutation from "swr/mutation"

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
  return {
    ...data,
    name_intl: transformIntoObject(data.name_intl),
    description_intl: transformIntoObject(data.description_intl),
    short_description_intl: transformIntoObject(data.short_description_intl),
    expiration_date: `${data.expiration_date}T00:00:00Z`,
    nettests: data.nettests.map(transformNettests),
  }
}

const defaultValues = {
  name: "",
  short_description: "",
  description: "",
  icon: "",
  color: "#000000",
  author: getUserEmail(),
  expiration_date: "",
  nettests: [
    {
      test_name: "web_connectivity",
      inputs: [],
      options: [],
      backend_options: [],
      is_background_run_enabled_default: false,
      is_manual_run_enabled_default: false,
    },
  ],
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const createLink = async (_: any, { arg }: any) => {
  return await createRunLink(transformOutgoingData(arg))
}

const Create: NextPage = () => {
  const router = useRouter()
  const { loading, user } = useUser()
  const isAdmin = useMemo(() => user?.role === "admin", [user])

  useEffect(() => {
    if (!user && !loading) router.push("/")
  }, [user, loading, router])

  const {
    trigger: onSubmit,
    isMutating,
    error,
  } = useSWRMutation("createLink", createLink, {
    onSuccess: (data) => {
      router.push(`/v2/${data.oonirun_link_id}`)
    },
    onError: (data) => {
      console.log(data)
    },
    throwOnError: false,
  })

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
              />
              <TestListForm
                isAdmin={isAdmin}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
              />
              <Box>{JSON.stringify(error?.message)}</Box>
            </Box>
          </Flex>
        </Container>
      )}
    </>
  )
}

export default Create
