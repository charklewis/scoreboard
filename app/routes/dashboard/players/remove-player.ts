import { redirect } from 'react-router'
import { type Route } from '+routes/dashboard/players/+types/remove-player'
import { removePlayer } from '~/database/player'
import { decode } from '~/services/public-ids'
import { sessionStorage } from '~/services/session'

async function action({ request, params }: Route.ActionArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId') as string
  console.log({ user, playerId: decode(params.playerId) })
  await removePlayer(user, decode(params.playerId))
  throw redirect('/dashboard/players')
}

export { action }
