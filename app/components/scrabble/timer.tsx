import { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, ModalBody, ModalContent, ModalHeader, Progress } from '@nextui-org/react'

import { Button } from '~/components/button'
import { useAlarm } from '~/components/use-alarm.tsx'

const THREE_MINUTES = 60 * 3

function Timer({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const { play } = useAlarm()
  const [timer, setTimer] = useState(0)

  const [timeInterval, setTimeInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (timer >= THREE_MINUTES) {
      if (timeInterval) {
        clearInterval(timeInterval)
        setTimeInterval(null)
      }
      play()
    }
  }, [timeInterval, timer, play])

  const startTimer = () => {
    setTimeInterval(
      setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    )
  }

  const pauseTimer = () => {
    if (timeInterval) {
      clearInterval(timeInterval)
      setTimeInterval(null)
    }
  }

  const resetTimer = () => {
    setTimer(0)
    if (timeInterval) {
      clearInterval(timeInterval)
      setTimeInterval(null)
    }
  }

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  const timeAsPercentage = useMemo(() => (timer / THREE_MINUTES) * 100, [timer])
  const timesUp = useMemo(() => timer >= THREE_MINUTES, [timer])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      backdrop="blur"
      data-testid="modal-timer"
      onClose={resetTimer}
    >
      <ModalContent>
        <ModalHeader className="mt-2">Timer</ModalHeader>
        <ModalBody>
          <Progress
            aria-label="Player timer"
            size="md"
            value={timeAsPercentage}
            color={timesUp ? 'success' : 'primary'}
            valueLabel={timesUp ? 'Finished' : formatTime(THREE_MINUTES - timer)}
            showValueLabel={true}
            className="max-w-md"
          />
          {timer === 0 ? (
            <Button id="start-timer" text="Start Timer" className="mt-6 w-full" color="primary" onPress={startTimer} />
          ) : timesUp ? (
            <Button id="reset-timer" text="Reset" color="primary" className="mt-6 w-full" onPress={resetTimer} />
          ) : timeInterval ? (
            <div className="mt-6 flex gap-2">
              <Button
                id="reset-timer"
                text="Reset"
                color="primary"
                className="w-full"
                variant="flat"
                onPress={resetTimer}
              />
              <Button
                id="pause-timer"
                text="Pause"
                color="primary"
                className="w-full"
                variant="flat"
                onPress={pauseTimer}
              />
            </div>
          ) : (
            <div className="mt-6 flex gap-2">
              <Button
                id="reset-timer"
                text="Reset"
                color="primary"
                className="w-full"
                onPress={resetTimer}
                variant="flat"
              />
              <Button id="continue-timer" text="Continue" color="primary" className="w-full" onPress={startTimer} />
            </div>
          )}
        </ModalBody>
        <div className="mb-8" />
      </ModalContent>
    </Modal>
  )
}

export { Timer }
