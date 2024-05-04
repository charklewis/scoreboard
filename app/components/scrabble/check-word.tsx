import { useFetcher } from '@remix-run/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Divider, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react'
import { Button } from '~/components/button'
import { Form, Input, InputGroup, Button as SubmitButton } from '~/components/form'

function Dictionary() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button id="dictionary" text="Dictionary" variant="flat" color="primary" onPress={onOpen} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true} backdrop="blur">
        <ModalContent>
          <ModalHeader className="mt-2">Dictionary</ModalHeader>
          <ModalBody>
            <CheckWord />
          </ModalBody>
          <div className="mb-8" />
        </ModalContent>
      </Modal>
    </>
  )
}

function CheckWord() {
  const fetcher = useFetcher<{ success: boolean; meaning?: string[]; word: string; score: number }>()

  return (
    <Form fetcher={fetcher} id="check-word" action="/scrabble" method="get">
      <InputGroup name="word">
        <Input label="" autoFocus size="lg" placeholder="Enter a word" />
      </InputGroup>

      <SubmitButton
        type="submit"
        id="submit-check-word"
        text="Check Word"
        loadingText="Checking"
        className="mt-6 w-full"
        color="primary"
      />
      {!fetcher.data ? null : fetcher.data.success ? (
        <>
          <Divider className="my-6" />
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-xl font-bold">
              {fetcher.data.score}
            </div>
            <div>
              <p className="text-lg font-semibold">{fetcher.data.word}</p>
              {fetcher.data.meaning ? <p>{fetcher.data.meaning.join(', ')}</p> : null}
            </div>
          </div>
        </>
      ) : (
        <>
          <Divider className="my-6" />
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-500">
              <XMarkIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold">{fetcher.data.word}</p>
              <p>This is not an official scrabble word</p>
            </div>
          </div>
        </>
      )}
    </Form>
  )
}

export { Dictionary }
