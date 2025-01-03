import { redirect } from 'react-router'
import  { type Route } from './sign-in/+types'
import { sessionStorage } from '~/services/session'

async function loader({ request }: Route.LoaderArgs) {
	let session = await sessionStorage.getSession(request.headers.get('cookie'))
	let user = session.get('userId')
	if (user) throw redirect('/dashboard')
	throw redirect('/sign-in')
}

export { loader }
