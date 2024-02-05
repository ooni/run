import TestListForm from "components/form/TestListForm"
import useUser from "hooks/useUser"
import { createRunLink, getRunLink, getUserEmail } from "lib/api"
import { GetServerSidePropsContext } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { Container } from "ooni-components"
import { transformOutgoingData } from "pages/create"
import { ParsedUrlQuery } from "querystring"
import { useCallback, useMemo } from "react"
import { generateRandomString } from "utils"

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
    include_author: formData?.author ? true : false,
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
  req,
  params,
}: GetServerSidePropsContext) => {
  const { linkId } = params as QParams
  const { cookies } = req
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  if (authToken) {
    try {
      const runLink = await getRunLink(
        linkId,
        { nocache: generateRandomString() },
        {
          ...(authToken && {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        },
      )
      const descriptor = runLink.descriptor
      if (runLink.mine) {
        return {
          props: {
            descriptor,
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
  descriptor: Descriptor
}

const EditRunLink = ({ descriptor }: EditRunLinkProps) => {
  const runLink = useMemo(
    () => (descriptor ? transformIncomingData(descriptor) : null),
    [descriptor],
  )
  const {
    push,
    query: { linkId },
  } = useRouter()

  const { user } = useUser()
  const isAdmin = useMemo(() => user?.role === "admin", [user])

  const onSubmit = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (data: any) => {
      createRunLink(transformOutgoingData(data), {
        ooni_run_link_id: linkId,
      }).then((res) => {
        push(`/v2/${res.ooni_run_link_id}`)
      })
    },
    [push, linkId],
  )

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
