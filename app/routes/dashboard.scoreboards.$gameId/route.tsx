import { json, type LoaderFunctionArgs } from '@remix-run/node'
import NewGame from './new-game'
import { identity } from '~/services/identity.server'
import { fetchPlayers } from './api.server'

async function loader({ request }: LoaderFunctionArgs) {
  const user = await identity.isAuthenticated(request)
  if (user) {
    const players = await fetchPlayers(user.stytchId)
    return json({ players })
  }
  return json({ players: [] })
}

function Game() {
  return (
    <section className="w-[calc(100%-18rem)] p-6">
      <NewGame />
    </section>
  )
}

export { loader }
export default Game
