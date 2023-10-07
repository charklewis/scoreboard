import { Dialog, Transition } from '@headlessui/react'
import { TrophyIcon, CogIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useLocation } from '@remix-run/react'
import classNames from 'classnames'
import { Fragment } from 'react'
import { IconOnlyButton } from '~/components/button'

const navigation = [
  { name: 'Scoreboards', href: 'dashboard', icon: TrophyIcon },
  // { name: 'Games', href: '#', icon: PuzzlePieceIcon },
  { name: 'Settings', href: 'settings', icon: CogIcon },
]

function Mobile({ show, onClose }: { show: boolean; onClose: Function }) {
  const location = useLocation()
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50 xl:hidden" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/5" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <IconOnlyButton
                    id="sidebar-mobile-close"
                    Icon={XMarkIcon}
                    description="Close sidebar"
                    onClick={() => onClose()}
                    className="-m-2.5 p-2.5"
                  />
                </div>
              </Transition.Child>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 ring-1 ring-black/5">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
                    alt="Your Company"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const current = location.pathname.includes(item.href)
                      return (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              current
                                ? 'bg-neutral-50 text-green-600'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-green-600',
                              'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6'
                            )}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function Desktop({ show }: { show: boolean }) {
  const location = useLocation()
  return (
    <div className={classNames('hidden', show ? 'xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col ' : '')}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-900/5 bg-neutral-700/5 px-6">
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
            alt="Your Company"
          />
        </div>
        <nav className="flex flex-1 flex-col ">
          <ul className="-mx-2 space-y-1">
            {navigation.map((item) => {
              const current = location.pathname.includes(item.href)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={classNames(
                      current
                        ? 'bg-neutral-50 text-green-600'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-green-600',
                      'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        current ? 'text-green-600' : 'text-neutral-400 group-hover:text-green-600',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export { Desktop, Mobile }
