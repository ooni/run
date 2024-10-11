import { useRouter } from 'next/router'
import { getDirection } from 'pages/_app'
import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'

import '@formatjs/intl-displaynames/polyfill'

import '@formatjs/intl-displaynames/locale-data/ar'
import '@formatjs/intl-displaynames/locale-data/de'
import '@formatjs/intl-displaynames/locale-data/en'
import '@formatjs/intl-displaynames/locale-data/es'
import '@formatjs/intl-displaynames/locale-data/fa'
import '@formatjs/intl-displaynames/locale-data/fr'
import '@formatjs/intl-displaynames/locale-data/my'
import '@formatjs/intl-displaynames/locale-data/pt'
import '@formatjs/intl-displaynames/locale-data/ru'
import '@formatjs/intl-displaynames/locale-data/sw'
import '@formatjs/intl-displaynames/locale-data/th'
import '@formatjs/intl-displaynames/locale-data/tr'
import '@formatjs/intl-displaynames/locale-data/vi'
import '@formatjs/intl-displaynames/locale-data/zh-Hans'
import '@formatjs/intl-displaynames/locale-data/zh-Hant'

export const getLocalisedLanguageName = (
  regionCode: string,
  locale: string,
) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(
      String(regionCode),
    )
  } catch (e) {
    return regionCode
  }
}

const languages = process.env.LOCALES
type LanguageSelectProps = {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  value: string
  children: ReactNode
}

const LanguageSelect = (props: LanguageSelectProps) => (
  <div className="flex items-center mb-1">
    <select
      className="
      appearance-none
      text-sm
      bg-transparent
      text-gray-50
      cursor-pointer
      capitalize 
      outline-none
      border-none
      p-0
      "
      {...props}
    />
    <span
      className="
      w-2
      h-2
      bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E')]
      bg-no-repeat
      bg-contain
    "
    />
  </div>
)

// const LanguageSelect = styled.select`
//   color: ${(props) => props.theme.colors.white};
//   background: none;
//   border: none;
//   text-transform: capitalize;
//   cursor: pointer;
//   font-family: inherit;
//   font-size: inherit;
//   padding: 0;
//   padding-bottom: 6px;
//   padding-right: 10px;
//   outline: none;
//   appearance: none;
//   -webkit-appearance: none;
//   -moz-appearance: none;
//   -ms-appearance: none;
//   -o-appearance: none;
//   background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
//   background-size: .6em;
//   background-position: 100% 0.2rem;
//   background-repeat: no-repeat;
//   html[dir="rtl"] &, body[dir="rtl"] &: {
//     background-position: 0, 0.2rem;
//   },
// `

const LocaleSwitcher = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { locale } = useIntl()

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const htmlEl = document.documentElement
    htmlEl.setAttribute('dir', getDirection(event.target.value))
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  return (
    <LanguageSelect onChange={handleLocaleChange} value={locale}>
      {languages.map((c) => (
        <option key={c} value={c}>
          {getLocalisedLanguageName(c, c)}
        </option>
      ))}
    </LanguageSelect>
  )
}

export default LocaleSwitcher
