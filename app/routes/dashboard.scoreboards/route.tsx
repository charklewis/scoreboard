import { type ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { Button, cn } from '@nextui-org/react'
import { namedAction } from 'remix-utils/named-action'

import { identity } from '~/services/identity.server'

import { fetchScoreboards, insertGame } from './api.server'
import { Game } from './game'

async function action({ request }: ActionFunctionArgs) {
  const user = await identity.isAuthenticated(request.clone())
  if (user) {
    return namedAction(request, {
      async scrabble() {
        try {
          const gameId = await insertGame('scrabble', user.stytchId)
          if (gameId) {
            return redirect(gameId)
          }
          return json({})
        } catch {
          return json({})
        }
      },
    })
  }
  return json({})
}

async function loader({ request }: LoaderFunctionArgs) {
  const user = await identity.isAuthenticated(request)
  if (user) {
    const scoreboards = await fetchScoreboards(user.stytchId)
    const inProgress = scoreboards.filter((scoreboard) => scoreboard.gameStatus === 'in-progress')
    const justStarted = scoreboards.filter((scoreboard) => scoreboard.gameStatus === 'new')
    const finished = scoreboards.filter((scoreboard) => scoreboard.gameStatus === 'finished')
    const noScoreboards = scoreboards.length === 0
    return json({ inProgress, justStarted, finished, noScoreboards })
  }
  return json({ inProgress: [], justStarted: [], finished: [], noScoreboards: true })
}

function Scoreboards() {
  const { inProgress, justStarted, finished, noScoreboards } = useLoaderData<typeof loader>() || { noScoreboards: true }

  const [showOutlet, setShowOutlet] = useState(false)

  if (noScoreboards) {
    return (
      <div className="flex h-[calc(100vh-65px)] items-center justify-center text-sm font-semibold text-neutral-500">
        No Scoreboards
      </div>
    )
  }

  return (
    <div className="flex">
      <div
        className={cn(
          'h-[calc(100vh-65px)] w-full overflow-y-scroll border-black/10 px-2 dark:border-white/10 lg:w-72 lg:border-r',
          showOutlet ? 'hidden lg:block' : 'block'
        )}
      >
        {justStarted?.length > 0 ? (
          <ul data-testid="list-scoreboards-new">
            <ScoreboardTitle name="New" />
            {justStarted.map((game) => (
              <Game key={game.id} scoreboard={game} showOutlet={() => setShowOutlet(true)} />
            ))}
          </ul>
        ) : null}
        {inProgress?.length > 0 ? (
          <ul data-testid="list-scoreboards-in-progress">
            <ScoreboardTitle name="In Progress" />
            {inProgress.map((game) => (
              <Game key={game.id} scoreboard={game} showOutlet={() => setShowOutlet(true)} />
            ))}
          </ul>
        ) : null}
        {finished?.length > 0 ? (
          <ul data-testid="list-scoreboards-completed">
            <ScoreboardTitle name="Completed" />
            {finished.map((game) => (
              <Game key={game.id} scoreboard={game} showOutlet={() => setShowOutlet(true)} />
            ))}
          </ul>
        ) : null}
      </div>
      <div className={cn('w-full p-6 lg:block lg:w-[calc(100%-18rem)]', showOutlet ? 'relative block' : 'hidden')}>
        <Button
          onClick={() => setShowOutlet(false)}
          data-testid="button-scoreboards-back"
          className="absolute left-3 top-4 lg:hidden"
          variant="light"
          size="sm"
          isIconOnly
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Outlet />
      </div>
    </div>
  )
}

function ScoreboardTitle({ name }: { name: string }) {
  return (
    <li>
      <p className="border-b border-black/10 py-2 text-xs font-semibold text-neutral-500 dark:border-white/10">
        {name}
      </p>
    </li>
  )
}

export { action, loader }
export default Scoreboards
