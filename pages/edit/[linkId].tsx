import TestListForm from "components/form/TestListForm"
import useUser from "hooks/useUser"
import { getRunLink, getUserEmail, updateRunLink } from "lib/api"
import type { GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import type { ParsedUrlQuery } from "node:querystring"
import { Container } from "ooni-components"
import { transformOutgoingData } from "pages/create"
import { useCallback, useMemo } from "react"

const OONIRunHero = dynamic(() => import("components/OONIRunHero"))

const transformIntoArray = (obj: object) =>
  Object.entries(obj).map(([k, v]) => ({
    key: k,
    value: v,
  }))

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const transformNettests = (nettest: any) => ({
  ...nettest,
  backend_options: transformIntoArray(nettest.backend_options),
  options: transformIntoArray(nettest.options),
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const transformIncomingData = (formData: any) => {
  return {
    ...formData,
    color: formData?.color ? formData.color : "#000000",
    author: formData?.author || getUserEmail(),
    name_intl: transformIntoArray(formData.name_intl),
    description_intl: transformIntoArray(formData.description_intl),
    short_description_intl: transformIntoArray(formData.short_description_intl),
    nettests: formData.nettests.map(transformNettests),
    expiration_date: formData.expiration_date.split("T")[0],
  }
}

interface QParams extends ParsedUrlQuery {
  linkId: string
}

export const getServerSideProps = async ({
  req,
  params,
}: GetServerSidePropsContext) => {
  const { linkId } = params as QParams
  const { cookies } = req
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  if (authToken) {
    try {
      const runLink = await getRunLink(linkId, {
        ...(authToken && {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        baseURL: process.env.NEXT_PUBLIC_OONI_API,
      })

      if (runLink.is_mine) {
        return {
          props: {
            runLink,
          },
        }
      }
    } catch (e) {}
  }
  return {
    redirect: {
      destination: "/",
    },
  }
}

type EditRunLinkProps = {
  runLink: Descriptor
}

const EditRunLink = ({ runLink }: EditRunLinkProps) => {
  const transformedRunLink = useMemo(
    () => (runLink ? transformIncomingData(runLink) : null),
    [runLink],
  )
  const { push } = useRouter()
  const { user } = useUser()
  const isAdmin = useMemo(() => user?.role === "admin", [user])

  const onSubmit = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (data: any) => {
      updateRunLink(runLink.oonirun_link_id, transformOutgoingData(data)).then(
        (res) => {
          push(`/v2/${res.oonirun_link_id}`)
        },
      )
    },
    [push, runLink],
  )

  return (
    <>
      <OONIRunHero />
      <Container>
        {transformedRunLink && (
          <TestListForm
            isAdmin={isAdmin}
            onSubmit={onSubmit}
            defaultValues={transformedRunLink}
            linkId={runLink.oonirun_link_id}
          />
        )}
      </Container>
    </>
  )
}

export default EditRunLink
