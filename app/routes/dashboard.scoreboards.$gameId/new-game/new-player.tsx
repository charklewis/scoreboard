import { Dialog, Transition } from '@headlessui/react'
import { useActionData, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { useState, Fragment, useEffect } from 'react'
import { LoadingSolidButton } from '~/components/button'
import { Form, TextField, InputGroup, ErrorMessage, ColorPicker, EmojiPicker } from '~/components/form'
import { color, emoji } from '~/database/static'

function CreateNewPlayer() {
  const action = useActionData<{ success: boolean; error: string }>()
  const [isOpen, setIsOpen] = useState(false)
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'

  const [selectedColor, setColor] = useState<keyof typeof color>()
  const [selectedEmoji, setEmoji] = useState<keyof typeof emoji>()

  useEffect(() => {
    if (action?.success) {
      closeModal()
    }
  }, [action])

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
        data-testid="button-create-new-player"
        className={clsx(
          'block w-max whitespace-nowrap rounded-md bg-green-600 px-3 py-1.5 shadow-sm hover:bg-green-500',
          'text-sm font-semibold leading-6 text-white',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600',
          'disabled:hover:bg-green-600'
        )}
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
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  data-testid="modal-new-player"
                >
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-neutral-900">
                    Create New Player
                  </Dialog.Title>

                  <p className="mt-2 text-sm text-neutral-500">This player will be available for all games.</p>

                  <div className="mt-4">
                    <Form id="create-new-player" action="?/createNewPlayer" className="space-y-6">
                      {selectedColor && selectedEmoji ? (
                        <div className="relative -mb-4">
                          <div
                            className={clsx(
                              color[selectedColor].bgColor,
                              'mx-auto flex h-40 w-40 items-center justify-center rounded-full'
                            )}
                          >
                            <div className=" text-8xl">{emoji[selectedEmoji]}</div>
                          </div>
                        </div>
                      ) : null}

                      <InputGroup name="name">
                        <TextField label="Name" input={{ type: 'text' }} />
                        <ErrorMessage />
                      </InputGroup>

                      <LoadingSolidButton
                        id="submit-create-new-player"
                        type="submit"
                        text="Add Player"
                        loadingText="Creating..."
                      />

                      {action?.error ? (
                        <p className="mt-2 text-sm text-red-600" data-testid="error-message-create-new-player">
                          {action.error}
                        </p>
                      ) : null}

                      <div className="h-1 border-t border-black/10" />

                      <InputGroup name="color">
                        <ColorPicker onChange={(value: any) => (color !== value ? setColor(value) : null)} />
                        <ErrorMessage />
                      </InputGroup>

                      <InputGroup name="emoji">
                        <EmojiPicker onChange={(value: any) => (emoji !== value ? setEmoji(value) : null)} />
                        <ErrorMessage />
                      </InputGroup>
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

export { CreateNewPlayer }
