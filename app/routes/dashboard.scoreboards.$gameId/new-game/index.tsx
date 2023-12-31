import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useActionData } from '@remix-run/react'
import { useState } from 'react'
import { LoadingSolidButton } from '~/components/button'
import { Form } from '~/components/form'
import { type Player as PlayerType } from '../api.server'
import { CreateNewPlayer } from './new-player'
import { Player } from './player'
import { SearchForPlayer } from './search-for-player'

function NewGame() {
  const { error } = useActionData<{ error: string }>() || {}
  const [players, setPlayers] = useState<PlayerType[]>([])

  const handleDragEnd = (event: DragEndEvent) => {
    const overId = event.over?.id
    const activeId = event.active?.id
    if (activeId !== overId) {
      setPlayers((items) => {
        const ids = items.map((value) => value.id)
        const oldIndex = ids.indexOf(activeId as string)
        const newIndex = ids.indexOf(overId as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const removePlayer = (id: string) => {
    setPlayers((value) => value.filter((player) => player.id !== id))
  }

  return (
    <div className="mx-auto max-w-screen-sm">
      <div>
        <div className="text-center">
          <h1 className="mt-2 text-base font-semibold leading-6 text-gray-900">Add Players</h1>
          <p className="mt-1 text-sm text-gray-500">You can add up to 4 players</p>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <SearchForPlayer
            playerLimitReached={players.length >= 4}
            addPlayer={(player: PlayerType) => setPlayers((value) => [...value, player])}
          />
          <CreateNewPlayer />
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]}>
        <SortableContext items={players} strategy={verticalListSortingStrategy}>
          <ul className="mt-6 divide-y divide-neutral-100" data-testid="container-selected-players">
            {players.map((player, index) => (
              <Player key={player.id} player={player} index={index} removePlayer={removePlayer} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {players.length > 1 ? (
        <Form id="start-game" action="?/startGame" className="mt-8">
          <input type="hidden" name="players" value={JSON.stringify(players.map((player) => player.id))} />
          <LoadingSolidButton id="start-game" type="submit" text="Start Game" loadingText="Starting game..." />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </Form>
      ) : null}
    </div>
  )
}

export { NewGame }
