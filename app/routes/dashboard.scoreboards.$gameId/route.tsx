import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'
import { array, number, object, string } from 'zod'

import { Scrabble } from '~/components/scrabble'
import { identity } from '~/services/identity.server'

import { addRound, fetchScoreboardAndPlayers, finishGame, insertPlayer, saveRound, startGame } from './api.server'
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
        } catch (error) {
          return json({
            error: 'An error occured while starting the game. If the error persists please try again later.',
          })
        }
      },
      async saveRound() {
        try {
          const formData = await request.formData()
          const players = array(object({ roundId: string(), playerId: string(), score: number() })).parse(
            JSON.parse(formData.get('players') as string)
          )
          await saveRound(players)
          return json({ success: true })
        } catch (error) {
          return json({
            error: 'An error occured while saving the game. If the error persists please try again later.',
          })
        }
      },
      async addRound() {
        try {
          const formData = await request.formData()
          const roundId = string().parse(formData.get('roundId'))
          await addRound(roundId)
          return json({ success: true })
        } catch (error) {
          return json({
            error: 'An error occured while adding a new round. If the error persists please try again later.',
          })
        }
      },
      async finishGame() {
        try {
          const formData = await request.formData()
          const roundId = string().parse(formData.get('roundId'))
          await finishGame(roundId)
          return json({ success: true })
        } catch (error) {
          return json({
            error: 'An error occured while adding a new round. If the error persists please try again later.',
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
    const { players, gameStatus, gameType, rounds } = await fetchScoreboardAndPlayers(user.stytchId, gameId)
    return json({ players, gameStatus, gameType, rounds })
  }
  return json({ players: [], gameStatus: 'error', gameType: '', rounds: [] })
}

function Game() {
  const { gameStatus, gameType, rounds } = useLoaderData<typeof loader>()

  return (
    <section>
      {gameStatus === 'new' ? (
        <NewGame />
      ) : gameStatus === 'in-progress' ? (
        <section className="pt-9 lg:pt-0">
          {gameType === 'scrabble' ? <Scrabble rounds={(rounds || []) as any} /> : <p>Game type not supported</p>}
        </section>
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
