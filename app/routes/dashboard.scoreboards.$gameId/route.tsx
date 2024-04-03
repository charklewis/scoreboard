import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'
import { array, string } from 'zod'

import { identity } from '~/services/identity.server'

import { type GameStatus, fetchScoreboardAndPlayers, insertPlayer, startGame } from './api.server'
import { NewGame } from './new-game'

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
  const { gameId } = params
  const user = await identity.isAuthenticated(request)
  if (user && gameId) {
    const { players, gameStatus } = await fetchScoreboardAndPlayers(user.stytchId, gameId)
    return json({ players, gameStatus })
  }
  return json({ players: [], gameStatus: 'error' })
}

function Game() {
  const { gameStatus } = useLoaderData<{ gameStatus: GameStatus }>()

  return (
    <section>
      {gameStatus === 'new' ? (
        <NewGame />
      ) : gameStatus === 'in-progress' ? (
        <p className="pt-9">in progress</p>
      ) : gameStatus === 'finished' ? (
        <p>finished</p>
      ) : (
        <p>error</p>
      )}
    </section>
  )
}

export { action, loader }
export default Game
