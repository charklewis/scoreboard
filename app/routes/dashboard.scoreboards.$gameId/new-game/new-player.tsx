import { useNavigation } from '@remix-run/react'
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment } from 'react'
import { clsx } from 'clsx'
import { Form, TextField, InputGroup, ErrorMessage, ColorPicker } from '~/components/form'
import { LoadingSolidButton } from '~/components/button'

function CreateNewPlayer() {
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <button
        id="button-create-new-player"
        type="button"
        disabled={isDisabled}
        onClick={openModal}
        className={clsx(
          'block w-max whitespace-nowrap rounded-md bg-green-600 px-3 py-1.5 shadow-sm hover:bg-green-500',
          'text-sm font-semibold leading-6 text-white',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600',
          'disabled:opacity-50 disabled:hover:bg-green-600'
        )}
        data-testid="button-create-new-player"
      >
        Create New Player
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-neutral-900">
                    Create New Player
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-500">This player will be available for all of your games.</p>
                  </div>

                  <div className="mt-4">
                    <Form id="create-new-player" action="?create-new-player" className="space-y-6">
                      <InputGroup name="name">
                        <TextField label="Name" input={{ type: 'text' }} />
                        <ErrorMessage />
                      </InputGroup>

                      <InputGroup name="color">
                        <ColorPicker />
                        <ErrorMessage />
                      </InputGroup>

                      {/* {errors?.generic ? (
                        <p className="mt-2 text-sm text-red-600" data-testid="error-message-generic">
                          {errors.generic}
                        </p>
                      ) : null} */}
                      <LoadingSolidButton
                        id="submit-create-new-player"
                        type="submit"
                        text="Add Player"
                        loadingText="Creating..."
                      />
                    </Form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CreateNewPlayer
