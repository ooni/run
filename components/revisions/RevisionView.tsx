import Revisions from 'components/v2/Revisions'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import DescriptorDetails from '../v2/DescriptorDetails'
import NettestsBox from '../v2/NettestsBox'

const RevisionView = ({ descriptor, linkId }: RevisionView) => {
  const intl = useIntl()
  const revisionDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(descriptor.date_created))

  return (
    <>
      <div className="bg-red-900 text-white text-center p-4">
        {intl.formatMessage(
          { id: 'RevisionView.TopNotice' },
          {
            date: revisionDate,
            link: (str: ReactNode) => (
              <Link
                className="text-white underline hover:text-white"
                href={`/v2/${linkId}`}
              >
                {str}
              </Link>
            ),
          },
        )}
      </div>
      <div className="container p-4 md:p-8">
        <h4>{intl.formatMessage({ id: 'RevisionView.LinkInfo' })}</h4>
        <DescriptorDetails descriptor={descriptor} />
        <div className="mt-8">
          <NettestsBox nettests={descriptor.nettests} />
        </div>
        <div className="mt-8">
          <Revisions length={descriptor.revision} linkId={linkId} />
        </div>
      </div>
    </>
  )
}

export default RevisionView
