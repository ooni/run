import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

export const getLocalisedLanguageName = (regionCode: string, locale: string) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  } 
}

const languages = process.env.LOCALES

const LanguageSelect = styled.select<{ml: number[]}>`
  color: ${props => props.theme.colors.white};
  background: none;
  border: none;
  text-transform: capitalize;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;
`

const LocaleSwitcher = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { locale } = useIntl()

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  return (
    <LanguageSelect ml={[0, 4]} onChange={handleLocaleChange} value={locale}>
      {languages.map((c) => (
        <option key={c} value={c}>
          {getLocalisedLanguageName(c,c)}
        </option>
      ))}
    </LanguageSelect>
  )
}

export default LocaleSwitcher