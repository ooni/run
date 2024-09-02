// import LocaleSwitcher from "components/LocaleSwitcher"
import useUser from "hooks/useUser"
import NLink from "next/link"
import { useRouter } from "next/router"
import { Box, Flex } from "ooni-components"
import type React from "react"
import { useState } from "react"
import { MdClose, MdMenu } from "react-icons/md"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

type StyledNavItemProps = {
  $active?: boolean
}

const StyledNavItem = styled.a<StyledNavItemProps>`
  position: relative;
  color: ${(props) => props.theme.colors.white};
  cursor: pointer;
  padding-bottom: ${(props) => (props.$active ? "4px" : "6px")};
  border-bottom: ${(props) =>
    props.$active ? `2px solid ${props.theme.colors.white}` : "none"};

  &:hover {
    padding-bottom: 4px;
    color: ${(props) => props.theme.colors.white};
    opacity: 1;
    border-bottom: 2px solid ${(props) => props.theme.colors.white};
  }
`

type NavItemProps = {
  label: React.ReactNode
  href: string
}

const NavItem = ({ label, href }: NavItemProps) => {
  const { pathname } = useRouter()
  const active = pathname === href

  return (
    <NLink href={href} legacyBehavior passHref>
      <StyledNavItem href={href} $active={active}>
        {label}
      </StyledNavItem>
    </NLink>
  )
}

type StyledNavBarProps = {
  $bgColor?: string
}

const StyledNavBar = styled.div<StyledNavBarProps>`
  background-color: ${(props) => props.$bgColor || props.theme.colors.blue5};
  z-index: 999;
`

const StyledResponsiveMenu = styled(Box)`
font-size: 14px;

.menuIcon,
.closeIcon {
  display: none;
}

@media screen and (max-width: 948px) {
  .menuIcon,
  .closeIcon {
    display: block;
    cursor: pointer;
  }

  .closeIcon {
    color: ${(props) => props.theme.colors.black};
  }

  .menuItemsWrapper {
    display: none;

    &.visible {
      z-index: 99999;
      display: block;
      overflow-y: scroll;
      max-height: 100%;
      padding: ${(props) => props.theme.space[4]}px;
      font-Size: 16px;
      position: fixed;
      top: 0;
      right: 0;
      background: ${(props) => props.theme.colors.gray0};
      
      .menuItems {
        padding-top: ${(props) => props.theme.space[2]}px;
        flex-direction: column;
        align-items: start;
        
        a {
          border-color: ${(props) => props.theme.colors.black};
        }

        a, select {
          opacity: 1;
          color: ${(props) => props.theme.colors.black};
        }
      }
    }
  }
}
`

export const NavBar = () => {
  const { user, logout } = useUser()

  const [showMenu, setShowMenu] = useState(false)

  const logoutUser = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    logout()
  }

  return (
    <StyledNavBar>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="end">
        <StyledResponsiveMenu color="white">
          <MdMenu
            size="28px"
            className="menuIcon"
            onClick={() => setShowMenu(!showMenu)}
          />
          <Box className={`menuItemsWrapper ${showMenu ? "visible" : ""}`}>
            {showMenu && (
              <Flex justifyContent="end">
                <MdClose
                  size="28px"
                  className="closeIcon"
                  onClick={() => setShowMenu(!showMenu)}
                />
              </Flex>
            )}
            <Flex className="menuItems" alignItems="center" sx={{ gap: 4 }}>
              {user?.is_logged_in && (
                <>
                  <NavItem
                    label={<FormattedMessage id="Navbar.List" />}
                    href="/list"
                  />
                  <NavItem
                    label={<FormattedMessage id="Navbar.Create" />}
                    href="/create"
                  />
                  <StyledNavItem onClick={logoutUser}>
                    <FormattedMessage id="Navbar.Logout" />
                  </StyledNavItem>
                </>
              )}
              {/* <LocaleSwitcher /> */}
            </Flex>
          </Box>
        </StyledResponsiveMenu>
      </Flex>
    </StyledNavBar>
  )
}

export default NavBar
