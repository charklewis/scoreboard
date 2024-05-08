import { useFetcher } from '@remix-run/react'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'

import { Button } from '~/components/button'

function EndGame({
  isOpen,
  onOpenChange,
  roundId,
}: {
  roundId?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const fetcher = useFetcher()

  const onClick = () => {
    if (!roundId) return
    fetcher.submit({ roundId }, { action: '?/finishGame', method: 'POST' })
    onOpenChange(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      backdrop="blur"
      data-testid="modal-end-game"
    >
      <ModalContent>
        <ModalHeader className="mt-2">Finish Game</ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to end the game? This action can not be undone. The game will no longer be able to be
            edited.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button id="cancel-game" text="Go Back" onPress={() => onOpenChange(false)} variant="flat" />
          <Button id="end-game" text="End Game" color="primary" onPress={onClick} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export { EndGame }
