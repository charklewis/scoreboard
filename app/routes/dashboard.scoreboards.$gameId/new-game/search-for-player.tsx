import { useLoaderData, useNavigation } from '@remix-run/react'
import { type Player } from '../api.server'
import { Autocomplete, AutocompleteItem, Avatar } from '@nextui-org/react'
import clsx from 'clsx'
import { color, emoji } from '~/database/static'

function SearchForPlayer({
  playerLimitReached,
  selectedPlayers,
  addPlayer,
}: {
  selectedPlayers: string[]
  playerLimitReached: boolean
  addPlayer: (player: Player) => void
}) {
  const navigation = useNavigation()

  const { players } = useLoaderData<{ players: Player[] }>()

  const filteredPlayers = players.filter((player) => !selectedPlayers.some((selected) => selected === player.id))
  const isDisabled =
    navigation.state !== 'idle' || players.length <= 0 || playerLimitReached || filteredPlayers.length <= 0

  const selectPlayer = (id: string) => {
    const player = players.find((player) => player.id === id)
    if (player) {
      addPlayer(player)
    }
  }

  return (
    <Autocomplete
      label="Search for a player to add to the game"
      onSelectionChange={(key) => selectPlayer(String(key))}
      isDisabled={isDisabled}
      variant="bordered"
      listboxProps={{ variant: 'flat' }}
      size="sm"
    >
      {filteredPlayers.map((player) => (
        <AutocompleteItem key={player.id} value={player.id} textValue={player.name}>
          <div className="flex items-center gap-2">
            <Avatar
              showFallback
              size="sm"
              className={clsx(player.background)}
              fallback={<div className="text-2xl">{player.emoji}</div>}
            />
            {player.name}
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export { SearchForPlayer }
