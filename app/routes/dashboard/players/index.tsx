import { data, Link, Outlet, useLoaderData, useLocation } from 'react-router'
import { type Route } from '+routes/dashboard/players/+types/index'
import { Button } from '~/components/ui/button'
import { fetchPlayers } from '~/database/player'
import { cn } from '~/lib/utils'
import { sessionStorage } from '~/services/session'

async function loader({ request }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId') as string
  const players = await fetchPlayers(user)
  return data(players || [])
}

function Players() {
  const location = useLocation()
  const players = useLoaderData<typeof loader>()
  return (
    <div className="grid grid-cols-[200px_auto] gap-4">
      <aside className="h-[calc(100vh-53px)] border-r border-neutral-100 p-4 dark:border-neutral-900">
        <Button variant="outline" asChild>
          <Link to="add-player" className="w-full">
            Add Player
          </Link>
        </Button>
        <div className="h-4 border-b border-neutral-100 dark:border-neutral-800" />
        {players.length > 0 ? (
          <ul>
            {players.map((player) => (
              <li
                key={player.id}
                className={cn(
                  location.pathname.includes(player.id) ? 'bg-neutral-50 font-medium dark:bg-neutral-900' : undefined,
                  'my-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800',
                )}
              >
                <Link to={player.id} className="flex h-full items-center gap-2 p-2">
                  <span
                    className={cn(
                      player.background,
                      'flex h-10 w-10 items-center justify-center rounded-full text-2xl',
                    )}
                  >
                    {player.emoji}
                  </span>{' '}
                  {player.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="flex h-[calc(100%-53px)] items-center justify-center text-xs font-semibold text-neutral-400 dark:text-neutral-700">
            No Players
          </p>
        )}
      </aside>
      <Outlet />
    </div>
  )
}

export { loader }
export default Players
