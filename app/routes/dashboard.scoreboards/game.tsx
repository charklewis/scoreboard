import { useLocation } from '@remix-run/react'
import { Fragment } from 'react'
import { cn } from '@nextui-org/react'

import { Link } from './link'
import { Players } from './players'

type Scoreboard = {
  id: string
  title: string
  createdAt: string
  players: {
    id: string
    name: string
    background: string
    emoji: string
  }[]
  gameStatus: string
}

function Game({ scoreboard, showOutlet }: { scoreboard: Scoreboard; showOutlet: Function }) {
  const location = useLocation()
  const isSelected = location.pathname.includes(scoreboard.id)
  return (
    <Fragment key={scoreboard.id}>
      <Link isSelected={isSelected} id={scoreboard.id} href={scoreboard.id}>
        <li className={cn('flex flex-wrap items-center justify-between gap-x-6 py-2')} onClick={() => showOutlet()}>
          <div>
            <p className="font-semibold capitalize leading-6">{scoreboard.title}</p>
            <div className="flex items-center gap-x-2 text-sm leading-5 text-neutral-500">
              <time dateTime={scoreboard.createdAt}>{new Date(scoreboard.createdAt).toDateString()}</time>
            </div>
          </div>
          {scoreboard.players.length > 0 ? (
            <dl className="mb-1.5 mt-1.5 flex w-full flex-none justify-between gap-x-8">
              <div className="ml-2 flex -space-x-0.5">
                <dt className="sr-only">Players</dt>
                <Players players={scoreboard.players} />
              </div>
            </dl>
          ) : null}
        </li>
      </Link>
    </Fragment>
  )
}

export { Game }
