import React from 'react'
import { NextRouter, useRouter } from 'next/router'
import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
// import { getLocalisedLanguageName } from 'utils/i18nCountries'
// import ExplorerLogo from 'ooni-components/components/svgs/logos/Explorer-HorizontalMonochromeInverted.svg'
import { Flex, Box, Container } from 'ooni-components'
import useUser from 'hooks/useUser'
import LocaleSwitcher from 'components/LocaleSwitcher'

type StyledNavItemProps = {
  onClick?: any
  children?: React.ReactNode
}

const StyledNavItem = styled.div<StyledNavItemProps>`
  text-decoration: none;
  position: relative;
  display: inline;
  padding-top: 4px;
  font-size: 14px;
`

const NavItemLabel = styled.span`
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;

  ${StyledNavItem}:hover & {
    opacity: 1;
  }
`

type UnderlineProps = {
  children?: React.ReactNode
  active?: boolean
}

const Underline = styled.span<UnderlineProps>`
  display: block;
  height: 2px;
  background: ${(props) => props.theme.colors.white};
  position: absolute;
  left: 0;
  bottom: -6px;

  width: ${(props) => (props.active ? '100%' : '0px')};
  ${StyledNavItem}:hover & {
    width: calc(100%);
  }
`

const LanguageSelect = styled.select`
  color: ${(props) => props.theme.colors.white};
  background: none;
  opacity: 0.6;
  border: none;
  text-transform: capitalize;
  cursor: pointer;
`
type NavItemComponentProps = {
  href: string
  label: string | JSX.Element
}

const NavItem = ({ label, href }: NavItemComponentProps) => {
  // const active = router.pathname === href
  return (
    <Box ml={[0, 4]} my={[2, 0]}>
      <NLink href={href}>
        <StyledNavItem>
          <NavItemLabel>{label}</NavItemLabel>
          {/* <Underline active={active} /> */}
        </StyledNavItem>
      </NLink>
    </Box>
  )
}

const StyledNavBar = styled.div`
  padding-top: 16px;
  padding-bottom: 20px;
`
const languages = process.env.LOCALES

export const NavBar = () => {
  const router = useRouter()
  const { pathname, asPath, query } = router
  const { user, logout } = useUser()

  const logoutUser = (e: KeyboardEvent) => {
    e.preventDefault()
    logout()
  }

  return (
    <StyledNavBar>
      <Container fontSize={1}>
        <Flex flexDirection={['column', 'row']} justifyContent={'flex-end'}>
          {user?.logged_in ? (
            <>
              <NavItem
                label={<FormattedMessage id="Navbar.List" />}
                href="/list"
              />
              <Box ml={[0, 4]} my={[2, 0]}>
                <StyledNavItem onClick={logoutUser}>
                  <NavItemLabel>
                    <FormattedMessage id="Navbar.Logout" />
                  </NavItemLabel>
                  {/* <Underline /> */}
                </StyledNavItem>
              </Box>
            </>
          ) : (
            <NavItem
              label={<FormattedMessage id="Navbar.Login" />}
              href="/login"
            />
          )}
          <Box ml={[0, 4]} my={[2, 0]}>
            <StyledNavItem>
              <LocaleSwitcher />
            </StyledNavItem>
          </Box>
        </Flex>
      </Container>
    </StyledNavBar>
  )
}

export default NavBar
