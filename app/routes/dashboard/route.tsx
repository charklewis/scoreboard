import { Bars3Icon, ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { DialogTrigger } from 'react-aria-components'
import { IconOnlyButton } from '~/components/button'
import { Desktop, Mobile } from './navbar'

export default function Example() {
  const [mobileViewOpen, setMobileViewOpen] = useState(false)
  const [desktopViewOpen, setDesktopViewOpen] = useState(true)
  return (
    <>
      <DialogTrigger>
        <div>
          <Mobile show={mobileViewOpen} onClose={() => setMobileViewOpen(false)} />
          <Desktop show={desktopViewOpen} />

          <div className={desktopViewOpen ? 'xl:pl-72' : 'xl:pl-0'}>
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-black/5 px-4 shadow-sm sm:px-6 lg:px-8">
              <IconOnlyButton
                id="sidebar-mobile"
                Icon={Bars3Icon}
                description="Open sidebar"
                onClick={() => setMobileViewOpen(true)}
                className="-m-2.5 xl:hidden"
              />
              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="relative w-full">
                  <IconOnlyButton
                    id="sidebar-desktop"
                    Icon={desktopViewOpen ? ArrowLeftOnRectangleIcon : ArrowRightOnRectangleIcon}
                    description={`${desktopViewOpen ? 'Close' : 'Open'} sidebar`}
                    onClick={() => setDesktopViewOpen((value) => !value)}
                    className="-ml-2.5 mt-2.5 hidden xl:inline"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
    </>
  )
}
