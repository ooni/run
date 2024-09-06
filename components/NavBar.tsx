// import LocaleSwitcher from "components/LocaleSwitcher"
import useUser from 'hooks/useUser'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type React from 'react'
import { type ReactNode, useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import { FormattedMessage } from 'react-intl'

const StyledNavItem = ({ isActive = false, href = '#', ...props }) => (
  <Link
    className={`
        block
        cursor-pointer
        text-sm
        text-white
        hover:pb-1
        hover:text-white
        hover:border-b-2
        hover:border-white
        ${isActive ? 'pb-[4px] border-b-2 border-white' : 'pb-[6px]'}`}
    href={href}
    {...props}
  />
)

type NavItemProps = { label: ReactNode; href: string }
const NavItem = ({ label, href, ...props }: NavItemProps) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    setIsActive(pathname === href)
  }, [pathname, href])

  return (
    <StyledNavItem isActive={isActive} href={href} {...props}>
      {label}
    </StyledNavItem>
  )
}

const languages = process.env.LOCALES

export const NavBar = () => {
  const router = useRouter()
  const { pathname } = router
  const { user, logout } = useUser()

  const [showMenu, setShowMenu] = useState(false)

  const logoutUser = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    setShowMenu(false)
    logout()
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShowMenu(false)
  }, [pathname])
  return (
    <div className="z-[8888]">
      <div className="StyledResponsiveMenu">
        <MdMenu
          size="28px"
          className="lg:hidden cursor-pointer text-white"
          onClick={() => setShowMenu(!showMenu)}
        />
        <div
          className={`z-[9999] lg:block ${showMenu ? 'block overflow-y-scroll max-h-full p-8 text-base fixed top-0 right-0 bg-gray-50' : 'hidden'}`}
        >
          {showMenu && (
            <div className="flex justify-end">
              <MdClose
                size="28px"
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          )}
          <div
            className={`flex gap-4 lg:gap-8 ${showMenu && 'pt-2 flex-col items-start [&>a]:border-black [&>a]:hover:border-black [&>*]:opacity-100 [&>*]:text-black [&>*]:hover:text-black'}`}
          >
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
                <StyledNavItem onClick={logoutUser} isActive={false}>
                  <FormattedMessage id="Navbar.Logout" />
                </StyledNavItem>
              </>
            )}
            {/* <LocaleSwitcher /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
