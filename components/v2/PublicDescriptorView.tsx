import { useIntl } from 'react-intl'
import DescriptorDetails from './DescriptorDetails'
import NettestsBox from './NettestsBox'
import Revisions from './Revisions'

const PublicDescriptorDetails = ({ descriptor, linkId }: DescriptorView) => {
  const intl = useIntl()
  return (
    <div className="bg-white p-6">
      <h4>{intl.formatMessage({ id: 'DescriptorView.LinkContent' })}</h4>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <DescriptorDetails descriptor={descriptor} />
          <div className="hidden lg:block mt-8">
            <Revisions length={descriptor.revision} linkId={linkId} />
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <NettestsBox nettests={descriptor.nettests} />
        </div>
        <div className="block lg:hidden">
          <Revisions length={descriptor.revision} linkId={linkId} />
        </div>
      </div>
    </div>
  )
}

export default PublicDescriptorDetails
