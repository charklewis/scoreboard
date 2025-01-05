import { ChevronDown, Dices, LogOut, PenLine } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '~/components/ui/navigation-menu'
import { cn } from '~/lib/utils'

function LinkButton({ description, children, ...props }: React.ComponentProps<typeof Link> & { description?: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          {...props}
          className={cn(
            props.className,
            'block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-300',
          )}
        >
          {children}
          {description ? (
            <span className="block font-normal leading-snug text-neutral-700 dark:text-neutral-400">{description}</span>
          ) : null}
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

function Header() {
  return (
    <>
      <header className="flex items-center justify-between border-b border-neutral-100 px-4 py-2 dark:border-neutral-900">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center rounded-md">
                <Dices className="size-6" />
                <PenLine className="size-6" />
              </div>
              <h1>Scoreboard</h1>
            </Link>
          </Button>
          <div className="h-4 border-r border-neutral-200 dark:border-neutral-800" />
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-normal">Games</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-[400px] gap-3 p-2">
                    <LinkButton
                      to="/dashboard/games/scrabble"
                      description="A word game where you create words to score points."
                    >
                      Scrabble
                    </LinkButton>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard/players" className="font-normal">
                      Players
                    </Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <User />
      </header>
      <Outlet />
    </>
  )
}

function User() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" asChild>
          <div className="flex items-center gap-1.5 text-sm font-normal [&_svg]:size-3">
            Account
            <ChevronDown />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem>
          <Link to="/sign-out" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Header
