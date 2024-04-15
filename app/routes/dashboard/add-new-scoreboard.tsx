import { useFetcher } from '@remix-run/react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Button as NextUiButton } from '@nextui-org/react'

function AddNewScoreboard() {
  const scrabble = useFetcher()

  const isDisabled = scrabble.state !== 'idle'

  return (
    <Dropdown isDisabled={isDisabled}>
      <DropdownTrigger>
        <NextUiButton data-testid="button-navbar-new-game" color="primary" variant="light">
          New Game
        </NextUiButton>
      </DropdownTrigger>
      <DropdownMenu color="primary" variant="flat" aria-label="New Game">
        <DropdownItem
          key="scrabble"
          onClick={() => scrabble.submit({}, { action: '/dashboard/scoreboards?/scrabble', method: 'POST' })}
          data-testid="button-navbar-new-game-scrabble"
        >
          Scrabble
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export { AddNewScoreboard }
