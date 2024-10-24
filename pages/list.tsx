import { getList } from 'lib/api'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import NLink from 'next/link'
import { useIntl } from 'react-intl'
import OONI404 from '/public/static/images/OONI_404.svg'

const RunLinkList = dynamic(() => import('components/List'))
const OONIRunHero = dynamic(() => import('components/OONIRunHero'))

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { cookies } = req
  const authToken = cookies?.token ? JSON.parse(cookies?.token).token : null

  if (!authToken)
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    }

  try {
    const response = await getList(
      {
        is_mine: true,
        is_expired: true,
      },
      {
        ...(authToken && {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        baseURL: process.env.NEXT_PUBLIC_OONI_API,
      },
    )
    const runLinks = await response?.oonirun_links?.sort(
      // archived links are shown at the end
      (a: Descriptor, b: Descriptor) =>
        Number(a.is_expired) - Number(b.is_expired),
    )

    return { props: { runLinks } }
  } catch (error) {
    return { props: { error: `Error: ${error}` } }
  }
}

type ListProps = {
  runLinks?: Descriptor[]
  error?: string
}

const List = ({ runLinks = [], error }: ListProps) => {
  const intl = useIntl()

  return (
    <>
      <OONIRunHero />
      <div className="shadow-[0_50vh_0_50vh] shadow-gray-100 bg-gray-100">
        <div className="container py-8">
          <h2 className="mb-4">{intl.formatMessage({ id: 'List.Title' })}</h2>
          {runLinks.length ? (
            <RunLinkList runLinks={runLinks} />
          ) : (
            <div className="flex p-6 gap-8 border border-gray-300 rounded-lg bg-white justify-between flex-wrap">
              <div>
                <h3 className="mb-4">
                  {intl.formatMessage({ id: 'List.Empty' })}
                </h3>
                <NLink href="/create">
                  <button type="button" className="btn btn-primary">
                    {intl.formatMessage({ id: 'List.Button.Create' })}
                  </button>
                </NLink>
              </div>
              <div>
                <OONI404 height="200px" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default List
