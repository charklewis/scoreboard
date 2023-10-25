import { Menu, Transition } from '@headlessui/react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { Form } from '~/components/form'
import { AddNewScoreboardButton } from './add-new-button'

function AddNewScoreboard() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          id="button-add-new-scoreboard"
          className="flex items-center rounded-md p-2.5 text-neutral-900 hover:bg-neutral-500/5"
        >
          <span className="sr-only">Open options for adding new a scoreboard</span>
          <PencilSquareIcon className="h-5 w-5" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ close }) => (
                <Form id="add-new-scoreboard" action="/dashboard/scoreboards?/scrabble">
                  <AddNewScoreboardButton id="scrabble" text="Scrabble" closeMenu={close} />
                </Form>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export { AddNewScoreboard }
