import { type Dispatch, type SetStateAction, useMemo } from 'react'
import { BookOpenIcon, ClockIcon, EyeIcon, EyeSlashIcon, PlusIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'

import { Dictionary } from './dictionary'
import { EndGame } from './end-game'
import { useInProgressContext } from './in-progress-context'
import { type RoundType } from './round'
import { Timer } from './timer'
import { useAddRound } from './use-add-round'

function Options({
  rounds,
  selectedRound,
  setSelectedRound,
}: {
  rounds: RoundType[]
  selectedRound: string
  setSelectedRound: Dispatch<SetStateAction<string>>
}) {
  const { showScore, toggleScore } = useInProgressContext()
  const currentRoundId = useMemo(
    () => rounds.find((round) => String(round.roundNumber) === selectedRound)?.id,
    [rounds, selectedRound]
  )
  const roundsAsIds = useMemo(() => rounds.map((round) => round.id), [rounds])

  const { addRound } = useAddRound({ rounds: roundsAsIds, selectedRound, setSelectedRound })
  const { isOpen: dictionaryIsOpen, onOpen: dictionaryOnOpen, onOpenChange: dictionaryOnOpenChange } = useDisclosure()
  const { isOpen: endGameIsOpen, onOpen: endGameOnOpen, onOpenChange: endGameOnOpenChange } = useDisclosure()
  const { isOpen: timerIsOpen, onOpen: timerOnOpen, onOpenChange: timerOnOpenChange } = useDisclosure()

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button color="primary" data-testid="button-game-options">
            Game Options
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Game Options" variant="flat">
          <DropdownSection title="Tools" showDivider>
            <DropdownItem
              key="dictionary"
              startContent={<BookOpenIcon className="size-5" />}
              onPress={dictionaryOnOpen}
              data-testid="button-game-options-dictionary"
            >
              Dictionary
            </DropdownItem>
            <DropdownItem
              key="timer"
              startContent={<ClockIcon className="size-5" />}
              onPress={timerOnOpen}
              data-testid="button-game-options-timer"
            >
              Timer
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Actions" showDivider>
            <DropdownItem
              key="add-round"
              startContent={<PlusIcon className="size-5" />}
              onPress={addRound}
              data-testid="button-game-options-add-round"
            >
              Add Round
            </DropdownItem>
            <DropdownItem
              key="scores"
              startContent={showScore ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
              onPress={toggleScore}
              closeOnSelect={false}
              data-testid="button-game-options-scores"
            >
              {showScore ? 'Hide Scores' : 'Show Scores'}
            </DropdownItem>
          </DropdownSection>
          <DropdownItem
            key="finish-game"
            color="primary"
            className="text-primary"
            description="This action can not be undone"
            onPress={endGameOnOpen}
            data-testid="button-game-options-end-game"
          >
            End Game
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dictionary isOpen={dictionaryIsOpen} onOpenChange={dictionaryOnOpenChange} />
      <EndGame roundId={currentRoundId} isOpen={endGameIsOpen} onOpenChange={endGameOnOpenChange} />
      <Timer isOpen={timerIsOpen} onOpenChange={timerOnOpenChange} />
    </>
  )
}

export { Options }
