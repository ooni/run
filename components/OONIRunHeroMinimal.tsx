import Link from 'next/link'
import { LogoOONIRun } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

const OONIRunHeroMinimal = () => (
  <div className="bg-blue-500 text-white text-base p-4">
    <Link href="/">
      <LogoOONIRun className="h-[28px]" />
    </Link>
    <div className="mt-2">
      <FormattedMessage id="Hero.SubTitle" />
    </div>
  </div>
)

export default OONIRunHeroMinimal
