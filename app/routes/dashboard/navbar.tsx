import { clsx } from 'clsx'
import { useState } from 'react'
import {
  Navbar as NextUiNavbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { LinkWithIcon } from './link'
import { Link } from '~/components/link'
import { AddNewScoreboard } from './add-new-scoreboard'

const navigation = [{ name: 'Scoreboards', href: 'dashboard/scoreboards' }]

function Navbar() {
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
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
            alt="Your Company"
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
              isBordered
              as="button"
              className="transition-transform"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              showFallback
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat" disabledKeys={['profile']}>
            <DropdownItem key="profile" className="h-14 gap-2 opacity-100" isReadOnly showDivider>
              <p className="font-semibold">zoey@example.com</p>
            </DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            id="scoreboard"
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
