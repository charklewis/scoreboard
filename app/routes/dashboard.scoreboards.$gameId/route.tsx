import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from '@remix-run/node'
import NewGame from './new-game'
import { identity } from '~/services/identity.server'
import { fetchPlayers, insertPlayer } from './api.server'
import { namedAction } from 'remix-utils/named-action'
import { string } from 'zod'

async function action({ request }: ActionFunctionArgs) {
  const user = await identity.isAuthenticated(request.clone())
  if (user) {
    return namedAction(request, {
      async createNewPlayer() {
        try {
          const formData = await request.formData()
          const name = string().parse(formData.get('name'))
          const color = string().parse(formData.get('color'))
          const emoji = string().parse(formData.get('emoji'))
          await insertPlayer(user.stytchId, { name, color, emoji })
          return json({ success: true })
        } catch {
          return json({
            error:
              'An error occured while creating a new player. Make sure you have entered a name, selected a color and emoji. If the error persists please try again later.',
          })
        }
      },
      async startGame() {
        return json({ success: true })
      },
    })
  }
  return json({})
}

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

export { action, loader }
export default Game
