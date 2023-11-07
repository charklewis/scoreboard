import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { XMarkIcon, Bars2Icon } from '@heroicons/react/20/solid'
import { useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { type Player as PlayerType } from '~/routes/dashboard.scoreboards.$gameId/api.server'

function ordinalSuffix(i: number) {
  var j = i % 10,
    k = i % 100
  if (j == 1 && k != 11) return i + 'st'
  if (j == 2 && k != 12) return i + 'nd'
  if (j == 3 && k != 13) return i + 'rd'
  return i + 'th'
}

function Player({
  player,
  index,
  removePlayer,
}: {
  player: PlayerType
  index: number
  removePlayer: (id: string) => void
}) {
  const navigation = useNavigation()
  const isDisabled = navigation.state !== 'idle'
  const { listeners, setNodeRef, transform, transition } = useSortable({
    id: player.id,
    disabled: isDisabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li className="group flex items-center justify-between py-3" ref={setNodeRef} style={style}>
      <div className="flex items-center space-x-2">
        <button
          {...listeners}
          className={clsx(
            'rounded-md p-1 text-neutral-400',
            isDisabled ? 'cursor-default' : 'cursor-move hover:bg-neutral-100 hover:text-neutral-600'
          )}
        >
          <Bars2Icon className="h-4 w-4" />
        </button>

        <div className={clsx('flex h-11 w-11 items-center justify-center rounded-full', player.background)}>
          <div className="text-2xl">{player.emoji}</div>
        </div>
        <p className="text-neutral-900">{player.name}</p>
      </div>
      <div className="flex items-center space-x-1">
        <p className="text-xs text-neutral-600">{ordinalSuffix(index + 1)} Player</p>
        <button
          onClick={() => removePlayer(player.id)}
          disabled={isDisabled}
          data-testid={`button-remove-player-${player.id}`}
          className={clsx(
            'rounded-md p-1 text-red-600 opacity-0 group-hover:opacity-100',
            isDisabled ? 'cursor-default' : 'hover:bg-red-50'
          )}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  )
}

export { Player }
