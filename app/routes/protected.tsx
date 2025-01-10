import { data, redirect } from 'react-router'
import { type Route } from '+routes/+types/protected'
import { sessionStorage } from '~/services/session'

async function loader({ request }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId')
  if (!user) throw redirect('/sign-in')
  return data(null)
}

export { loader }
