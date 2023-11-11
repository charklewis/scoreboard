import { type LoaderFunctionArgs, json, type ActionFunctionArgs, redirect } from '@remix-run/node'
import { Outlet, useLoaderData, useLocation } from '@remix-run/react'
import { clsx } from 'clsx'
import { Fragment, useState } from 'react'
import { namedAction } from 'remix-utils/named-action'
import { identity } from '~/services/identity.server'
import { fetchScoreboards, insertGame } from './api.server'
import { Link } from './link'
import { Player } from './player'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'

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
    return json(scoreboards)
  }
  return json([])
}

function Scoreboards() {
  const scoreboards = useLoaderData<typeof loader>()
  const location = useLocation()
  const [showOutlet, setShowOutlet] = useState(false)

  return (
    <div className="flex">
      <ul
        className={clsx(
          'h-[calc(100vh-64px)] w-full overflow-y-scroll border-black/10 px-2 lg:w-72 lg:border-r',
          showOutlet ? 'hidden lg:block' : 'block'
        )}
      >
        {!scoreboards || scoreboards.length === 0 ? (
          <li className="flex h-full items-center justify-center text-sm font-semibold text-neutral-500">
            No Scoreboards
          </li>
        ) : (
          scoreboards.map((scoreboard: any) => {
            const isSelected = location.pathname.includes(scoreboard.id)
            return (
              <Fragment key={scoreboard.id}>
                <Link isSelected={isSelected} id={scoreboard.id} href={scoreboard.id}>
                  <li
                    className={clsx('flex flex-wrap items-center justify-between gap-x-6 py-2')}
                    onClick={() => setShowOutlet(true)}
                  >
                    <div>
                      <p className="text-sm font-semibold capitalize leading-6 text-neutral-900">{scoreboard.title}</p>
                      <div className="flex items-center gap-x-2 text-xs leading-5 text-neutral-500">
                        <time dateTime={scoreboard.createdAt}>{new Date(scoreboard.createdAt).toDateString()}</time>
                      </div>
                    </div>
                    <dl className="mt-1 flex w-full flex-none justify-between gap-x-8">
                      <div className="flex -space-x-0.5">
                        <dt className="sr-only">Players</dt>
                        {scoreboard.players.map((player: any) => (
                          <Player key={player.id} player={player} />
                        ))}
                      </div>
                    </dl>
                  </li>
                </Link>
                <div className="border-t border-black/5" />
              </Fragment>
            )
          })
        )}
      </ul>
      <div className={clsx('w-full p-6 lg:block lg:w-[calc(100%-18rem)]', showOutlet ? 'relative block' : 'hidden')}>
        <button
          className="absolute left-5 top-[2.125rem] flex items-center text-sm font-medium text-green-600 lg:hidden"
          onClick={() => setShowOutlet(false)}
          data-testid="button-scoreboards-back"
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Back
        </button>
        <Outlet />
      </div>
    </div>
  )
}

export { action, loader }
export default Scoreboards
