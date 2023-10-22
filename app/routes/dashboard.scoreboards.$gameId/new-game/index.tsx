import { useState } from 'react'
import SearchForPlayer from './search-for-player'
import { type Player } from '../api.server'
import CreateNewPlayer from './new-player'

function NewGame() {
  const [players, setPlayers] = useState<Player[]>([])
  console.log({ players })
  return (
    <div className="mx-auto">
      <div>
        <div className="text-center">
          <h1 className="mt-2 text-base font-semibold leading-6 text-gray-900">Add Players</h1>
          <p className="mt-1 text-sm text-gray-500">You can add up to 4 players</p>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <SearchForPlayer addPlayer={(player: Player) => setPlayers((value) => [...value, player])} />
          <CreateNewPlayer />
        </div>
      </div>
      {/* 
        player grid
        - order of players (drag and drop)
        - their emoji and name
        - button to delete
      */}
    </div>
  )
}

export default NewGame
