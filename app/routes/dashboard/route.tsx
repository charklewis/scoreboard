import { Bars3Icon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { useState } from 'react'
import { AddNewScoreboard } from './add-new-scoreboard'
import { Button } from './button'
import { Desktop, Mobile } from './navbar'

function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url.toLowerCase())
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return redirect('/dashboard/scoreboards')
  }
  return null
}

function Dashboard() {
  const [mobileViewOpen, setMobileViewOpen] = useState(false)
  const [desktopViewOpen, setDesktopViewOpen] = useState(true)
  return (
    <div>
      <Mobile show={mobileViewOpen} onClose={() => setMobileViewOpen(false)} />
      <Desktop show={desktopViewOpen} />
      <div className={desktopViewOpen ? 'xl:pl-64' : 'xl:pl-0'}>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-2 border-b border-black/10 bg-white px-4 shadow-sm sm:px-6 lg:px-6">
          <Button
            id="sidebar-mobile"
            Icon={Bars3Icon}
            description="Open sidebar"
            onClick={() => setMobileViewOpen(true)}
            className="xl:hidden"
          />
          <Button
            id="sidebar-desktop"
            Icon={desktopViewOpen ? ArrowLeftIcon : Bars3Icon}
            description={`${desktopViewOpen ? 'Close' : 'Open'} sidebar`}
            onClick={() => setDesktopViewOpen((value) => !value)}
            className="hidden xl:inline"
          />
          <div className="block h-6 border-r border-black/10" />
          <AddNewScoreboard />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { loader }
export default Dashboard
