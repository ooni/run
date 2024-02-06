import { useRouter } from "next/router"
import { useIntl } from "react-intl"
import styled from "styled-components"

export const getLocalisedLanguageName = (
  regionCode: string,
  locale: string,
) => {
  try {
    return new Intl.DisplayNames([locale], { type: "language" }).of(
      String(regionCode),
    )
  } catch (e) {
    return regionCode
  }
}

const languages = process.env.LOCALES

const LanguageSelect = styled.select`
  color: ${(props) => props.theme.colors.white};
  background: none;
  border: none;
  text-transform: capitalize;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  padding-bottom: 6px;
  padding-right: 10px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23FFFFFF%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23FFFFFF%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E");
  background-size: .6em;
  background-position: 100% 0.3rem;
  background-repeat: no-repeat;
  html[dir="rtl"] &, body[dir="rtl"] &: {
    background-position: 0, 0.3rem;
  },
`

const LocaleSwitcher = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { locale } = useIntl()

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
