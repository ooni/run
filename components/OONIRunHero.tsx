import NLink from 'next/link'
import { LogoOONIRun } from 'ooni-components'
import { FormattedMessage } from 'react-intl'

import NavBar from 'components/NavBar'

const OONIRunHero = () => (
  <div className="bg-blue-500">
    <div className="container py-6">
      <div className="flex justify-between">
        <div className="text-white text-base">
          <NLink href="/">
            <LogoOONIRun className="h-[48px]" />
          </NLink>
          <div className="mt-2">
            <FormattedMessage id="Hero.SubTitle" />
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  </div>
)

export default OONIRunHero
