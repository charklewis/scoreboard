import { redirect } from 'react-router'
import { type Route } from '+routes/+types/sign-out'
import { sessionStorage } from '~/services/session'

async function loader({ request }: Route.ActionArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  throw redirect('/sign-in', {
    headers: { 'Set-Cookie': await sessionStorage.destroySession(session) },
  })
}

export { loader }
