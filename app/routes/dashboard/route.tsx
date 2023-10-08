import { Bars3Icon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { Outlet } from '@remix-run/react'
import { useState } from 'react'
import { IconOnlyButton } from '~/components/button'
import { Desktop, Mobile } from './navbar'

function Dashboard() {
  const [mobileViewOpen, setMobileViewOpen] = useState(false)
  const [desktopViewOpen, setDesktopViewOpen] = useState(true)
  return (
    <div>
      <Mobile show={mobileViewOpen} onClose={() => setMobileViewOpen(false)} />
      <Desktop show={desktopViewOpen} />
      <div className={desktopViewOpen ? 'xl:pl-72' : 'xl:pl-0'}>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-black/5 px-4 shadow-sm sm:px-6 lg:px-8">
          <IconOnlyButton
            id="sidebar-mobile"
            Icon={Bars3Icon}
            description="Open sidebar"
            onClick={() => setMobileViewOpen(true)}
            className="-m-2.5 xl:hidden"
          />
          <IconOnlyButton
            id="sidebar-desktop"
            Icon={desktopViewOpen ? ArrowLeftOnRectangleIcon : ArrowRightOnRectangleIcon}
            description={`${desktopViewOpen ? 'Close' : 'Open'} sidebar`}
            onClick={() => setDesktopViewOpen((value) => !value)}
            className="-ml-2.5 hidden xl:inline"
          />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
