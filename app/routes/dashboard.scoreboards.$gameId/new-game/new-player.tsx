import { useActionData, useNavigation } from '@remix-run/react'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure, Avatar, Divider, cn } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { Button } from '~/components/button'
import {
  Form,
  InputGroup,
  ErrorMessage,
  ColorPicker,
  EmojiPicker,
  Input,
  Button as FormButton,
} from '~/components/form'
import { color, emoji } from '~/database/static'

type Color = keyof typeof color
type Emoji = keyof typeof emoji

function CreateNewPlayer() {
  const action = useActionData<{ success: boolean; error: string }>()
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [selectedColor, setColor] = useState<Color>()
  const [selectedEmoji, setEmoji] = useState<Emoji>()

  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'

  useEffect(() => {
    if (action?.success) {
      onClose()
    }
  }, [action])

  return (
    <>
      <Button
        id="create-new=player"
        text="Create New Player"
        color="primary"
        onPress={onOpen}
        className="w-48"
        isDisabled={isDisabled}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" hideCloseButton={true}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Create New Player</ModalHeader>
          <ModalBody>
            {selectedColor && selectedEmoji ? (
              <div>
                <Avatar
                  showFallback
                  size="lg"
                  className={cn(color[selectedColor].bgColor, 'mx-auto')}
                  fallback={<div className=" text-4xl">{emoji[selectedEmoji]}</div>}
                />
              </div>
            ) : null}
            <Form id="create-new-player" action="?/createNewPlayer" className="space-y-6">
              <InputGroup name="name">
                <Input label="Name" autoFocus />
              </InputGroup>

              <FormButton
                id="submit-create-new-player"
                type="submit"
                text="Add Player"
                loadingText="Creating..."
                color="primary"
                className="w-full"
              />

              {action?.error ? (
                <p className="mt-2 text-sm text-red-600" data-testid="error-message-create-new-player">
                  {action.error}
                </p>
              ) : null}

              <Divider className="my-4" />

              <InputGroup name="color">
                <ColorPicker onChange={(value: Color) => (selectedColor !== value ? setColor(value) : null)} />
                <ErrorMessage />
              </InputGroup>

              <InputGroup name="emoji">
                <EmojiPicker onChange={(value: Emoji) => (selectedEmoji !== value ? setEmoji(value) : null)} />
                <ErrorMessage />
              </InputGroup>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export { CreateNewPlayer }
