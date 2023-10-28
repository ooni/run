import React from 'react'
import { useRouter } from 'next/router'
import NLink from 'next/link'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Flex, Box, Container } from 'ooni-components'
import useUser from 'hooks/useUser'
import LocaleSwitcher from 'components/LocaleSwitcher'

type StyledNavItemProps = {
  onClick?: any
  children?: React.ReactNode
  href?: string
}

const StyledNavLink = styled(NLink)<StyledNavItemProps>`
  text-decoration: none;
  position: relative;
  display: inline;
  font-size: 14px;
`

const StyledNavButton = styled.span<StyledNavItemProps>`
  position: relative;
  display: inline;
  font-size: 14px;
  line-height: 1;
  button {
    all: unset;
  }
`

const NavItemLabel = styled.span`
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  ${StyledNavLink}:hover & {
    opacity: 1;
  }
  ${StyledNavButton}:hover & {
    opacity: 1;
  }
`

type UnderlineProps = {
  children?: React.ReactNode
  $active?: boolean
}

const Underline = styled.span<UnderlineProps>`
  display: block;
  height: 2px;
  background: ${(props) => props.theme.colors.white};
  position: absolute;
  left: 0;
  bottom: -6px;

  width: ${(props) => (props.$active ? '100%' : '0px')};
  ${StyledNavLink}:hover & {
    width: calc(100%);
  }
  ${StyledNavButton}:hover & {
    width: calc(100%);
  }
`

type NavItemComponentProps = {
  href?: string
  label: string | JSX.Element
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}

const NavItem = ({ label, href, onClick }: NavItemComponentProps) => {
  const router = useRouter()
  const active = router.pathname === href
  return (
    <Box ml={[0, 4]} my={[2, 0]}>
      {href && (
        <StyledNavLink href={href}>
          <NavItemLabel>{label}</NavItemLabel>
          <Underline $active={active} />
        </StyledNavLink>
      )}
      {onClick && (
        <StyledNavButton>
          <button type="button" onClick={onClick}>
            <NavItemLabel>{label}</NavItemLabel>
          </button>
          <Underline $active={active} />
        </StyledNavButton>
      )}
    </Box>
  )
}

export const NavBar = () => {
  const { user, logout } = useUser()

  const logoutUser = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    logout()
  }

  return (
    <Flex>
      <Flex flexDirection={['column', 'row']} justifyContent={'flex-end'}>
        {user?.logged_in && (
          <>
            <NavItem label={<FormattedMessage id="Navbar.List" />} href="/list" />
            <NavItem
              label={<FormattedMessage id="Navbar.Create" />}
              href="/create"
            />
            <NavItem
              label={<FormattedMessage id="Navbar.Logout" />}
              onClick={logoutUser}
            />
          </>
        )}
        <Box ml={[0, 4]}>
          <LocaleSwitcher />
        </Box>
      </Flex>
    </Flex>
  )
}

export default NavBar
