import { useLoaderData, useNavigation } from '@remix-run/react'
import { type Player } from '../api.server'
import { Autocomplete, AutocompleteItem, Avatar } from '@nextui-org/react'

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
      placeholder="Search for a player to add to the game"
      onSelectionChange={(key) => selectPlayer(String(key))}
      isDisabled={isDisabled}
      variant="bordered"
      listboxProps={{ variant: 'flat' }}
      selectorButtonProps={{ variant: 'light' }}
      data-testid="input-search-for-player"
      aria-label="Search for a player to add to the game"
    >
      {filteredPlayers.map((player) => (
        <AutocompleteItem key={player.id} value={player.id} textValue={player.name}>
          <div className="flex items-center gap-2" data-testid={`search-for-player-${player.id}`}>
            <Avatar
              showFallback
              size="sm"
              className={player.background}
              fallback={<div className="text-2xl">{player.emoji}</div>}
              aria-label={player.name}
            />
            {player.name}
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  )
}

export { SearchForPlayer }
