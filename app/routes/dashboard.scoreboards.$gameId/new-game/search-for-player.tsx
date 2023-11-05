import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useLoaderData, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { type Player } from '../api.server'

function SearchForPlayer({
  playerLimitReached,
  addPlayer,
}: {
  playerLimitReached: boolean
  addPlayer: (player: Player) => void
}) {
  const navigation = useNavigation()
  const [query, setQuery] = useState('')
  const { players } = useLoaderData<{ players: Player[] }>()

  const isDisabled = navigation.state !== 'idle' || players.length <= 0 || playerLimitReached

  const filteredPlayers =
    query === ''
      ? players
      : players.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox as="div" className="w-full">
      <Combobox.Label className="sr-only">Search for a player to add to the game</Combobox.Label>
      <div className="relative">
        <Combobox.Input
          className={clsx(
            'w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 sm:text-sm sm:leading-6',
            isDisabled ? 'pointer-events-none' : 'focus:ring-2 focus:ring-inset focus:ring-green-600'
          )}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            playerLimitReached
              ? 'Player limit reached'
              : players.length > 0
              ? 'Search for a player'
              : 'No players available'
          }
          readOnly={isDisabled}
          data-testid="input-search-for-player"
        />
        {isDisabled ? null : (
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
          </Combobox.Button>
        )}

        {filteredPlayers.length > 0 ? <Combobox.Options
            className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            data-testid="container-search-for-player-options"
          >
            {filteredPlayers.map((player) => (
              <Combobox.Option
                key={player.id}
                value={player}
                onClick={() => addPlayer(player)}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9 hover:cursor-pointer',
                    active ? 'bg-neutral-100 text-black' : 'text-neutral-900'
                  )
                }
              >
                <div className="ml-3 truncate">{player.name}</div>
              </Combobox.Option>
            ))}
          </Combobox.Options> : null}
      </div>
    </Combobox>
  )
}

export { SearchForPlayer }
