import { useActionData } from '@remix-run/react'
import { useState } from 'react'
import { Button, Form } from '~/components/form'
import { type Player as PlayerType } from '../api.server'
import { CreateNewPlayer } from './new-player'
import { Players } from './players'
import { SearchForPlayer } from './search-for-player'

function NewGame() {
  const { error } = useActionData<{ error: string }>() || {}
  const [players, setPlayers] = useState<PlayerType[]>([])

  const movePlayer = (id: string, direction: 'up' | 'down') => {
    setPlayers((items) => {
      const ids = items.map((value) => value.id)
      const index = ids.indexOf(id)
      const newIndex = direction === 'up' ? index - 1 : index + 1
      const newItems = [...items]
      newItems[index] = items[newIndex]
      newItems[newIndex] = items[index]
      return newItems
    })
  }

  const removePlayer = (id: string) => {
    setPlayers((value) => value.filter((player) => player.id !== id))
  }

  return (
    <div className="mx-auto max-w-screen-sm">
      <div>
        <div className="text-center">
          <h1 className="mt-2 text-base font-semibold leading-6">Add Players</h1>
          <p className="mt-1 text-sm">You can add up to 4 players</p>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <SearchForPlayer
            playerLimitReached={players.length >= 4}
            selectedPlayers={players.map((player) => player.id)}
            addPlayer={(player: PlayerType) => {
              setPlayers((value) => [...value, player])
            }}
          />
          <CreateNewPlayer />
        </div>
      </div>

      <Players players={players} removePlayer={removePlayer} movePlayer={movePlayer} />

      {players.length > 1 ? (
        <Form id="start-game" action="?/startGame" className="mt-8">
          <input type="hidden" name="players" value={JSON.stringify(players.map((player) => player.id))} />
          <Button
            id="start-game"
            type="submit"
            text="Start Game"
            loadingText="Starting game..."
            className="w-full"
            color="primary"
          />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </Form>
      ) : null}
    </div>
  )
}

export { NewGame }
