import { type ActionFunctionArgs, json, type LoaderFunctionArgs } from '@remix-run/node'
import NewGame from './new-game'
import { identity } from '~/services/identity.server'
import { fetchPlayers, insertPlayer, startGame } from './api.server'
import { namedAction } from 'remix-utils/named-action'
import { array, string } from 'zod'

async function action({ request, params }: ActionFunctionArgs) {
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
        try {
          const { gameId } = params
          if (!gameId) throw new Error('No game id provided')
          const formData = await request.formData()
          const players = array(string())
            .min(2)
            .max(4)
            .parse(JSON.parse(formData.get('players') as string))
          await startGame(user.stytchId, { gameId, players })
          return json({ success: true })
        } catch {
          return json({
            error: 'An error occured while starting the game. If the error persists please try again later.',
          })
        }
      },
    })
  }
  return json({})
}

async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await identity.isAuthenticated(request)
  if (user) {
    const players = await fetchPlayers(user.stytchId)
    //todo: get game from params and load information
    //this is to check if its a new game (ie no rounds) or a game ready to play
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
