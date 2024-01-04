import { useRouter } from 'next/router'
import { Flex, Box, Container } from 'ooni-components'
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
`

const LocaleSwitcher = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { locale } = useIntl()

  const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({ pathname, query }, asPath, { locale: event.target.value })
  }

  return (
    <Container>
      <Flex justifyContent='flex-end'>
        <Box>
          <LanguageSelect ml={[0, 4]} onChange={handleLocaleChange} value={locale}>
            {languages.map((c) => (
              <option key={c} value={c}>
                {getLocalisedLanguageName(c,c)}
              </option>
            ))}
          </LanguageSelect>
        </Box>
      </Flex>
    </Container>
  )
}

export default LocaleSwitcher