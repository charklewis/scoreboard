import { useState } from 'react'
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUiNavbar,
} from '@nextui-org/react'

import { Link } from '~/components/link'

import { AddNewScoreboard } from '~/routes/dashboard/add-new-scoreboard'

function Navbar({ user }: { user: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <NextUiNavbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} position="static" maxWidth="full">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
      </NavbarContent>

      <NavbarContent className="pr-3 sm:hidden" justify="center">
        <NavbarBrand>
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
            alt="Your Company"
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarBrand>
          <img
            data-testid="image-navbar-logo"
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
            alt="Scoreboards"
          />
        </NavbarBrand>
        <NavbarItem>
          <Link id="scoreboard" text="Scoreboards" href="/dashboard/scoreboards" color="foreground" />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <AddNewScoreboard />
        </NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              data-testid="button-navbar-profile"
              isBordered
              as="button"
              size="sm"
              showFallback
              className="text-white"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" disabledKeys={['profile']}>
            <DropdownItem textValue="email" key="profile" className="h-14 gap-2 opacity-100" isReadOnly showDivider>
              <p className="font-semibold" data-testid="navbar-text-email">
                {user}
              </p>
            </DropdownItem>
            <DropdownItem key="settings" href="/settings">
              <Link id="settings" href="/settings" size="sm" text="Settings" color="foreground" />
            </DropdownItem>
            <DropdownItem key="logout" color="danger" className="text-danger" href="/logout">
              <Link id="logout" href="/logout" color="danger" size="sm" text="Log out" />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            id="mobile-scoreboard"
            text="Scoreboards"
            href="/dashboard/scoreboards"
            color="foreground"
            className="w-full"
            size="lg"
          />
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUiNavbar>
  )
}

export { Navbar }