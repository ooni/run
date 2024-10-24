import type { NextPage } from 'next'
import { useEffect, useMemo } from 'react'
import { useIntl } from 'react-intl'

import TestListForm from 'components/form/TestListForm'
import SpinLoader from 'components/vendor/SpinLoader'
import useUser from 'hooks/useUser'
import { createRunLink, getUserEmail } from 'lib/api'
import Markdown from 'markdown-to-jsx'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useSWRMutation from 'swr/mutation'

const OONIRunHero = dynamic(() => import('components/OONIRunHero'))

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
  name: '',
  short_description: '',
  description: '',
  icon: '',
  color: '#000000',
  author: getUserEmail(),
  expiration_date: '',
  nettests: [
    {
      test_name: 'web_connectivity',
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
  const intl = useIntl()
  const router = useRouter()
  const { loading, user } = useUser()
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  useEffect(() => {
    if (!user && !loading) router.push('/')
  }, [user, loading, router])

  const {
    trigger: onSubmit,
    isMutating,
    error,
  } = useSWRMutation('createLink', createLink, {
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
        <div className="flex p-32 justify-center items-center">
          <SpinLoader />
        </div>
      ) : (
        <div className="container pt-8 max-w-[800px]">
          <h2 className="mb-3">
            {intl.formatMessage({ id: 'Navbar.Create' })}
          </h2>
          <Markdown>
            {intl.formatMessage({ id: 'WhatCanYouDoText.WebCensorship' })}
          </Markdown>
          <TestListForm
            isAdmin={isAdmin}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
          />
          <div>{JSON.stringify(error?.message)}</div>
        </div>
      )}
    </>
  )
}

export default Create
