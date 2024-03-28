import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button as NextUiButton } from '@nextui-org/react'
import { useFetcher } from '@remix-run/react'

function AddNewScoreboard() {
  const scrabble = useFetcher()

  const isDisabled = scrabble.state !== 'idle'

  return (
    <Dropdown isDisabled={isDisabled}>
      <DropdownTrigger>
        <NextUiButton color="primary" variant="bordered">
          New Game
        </NextUiButton>
      </DropdownTrigger>
      <DropdownMenu color="primary" variant="flat" aria-label="New Game">
        <DropdownItem
          key="scrabble"
          onClick={() => scrabble.submit({}, { action: '/dashboard/scoreboards?/scrabble', method: 'POST' })}
        >
          Scrabble
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export { AddNewScoreboard }
