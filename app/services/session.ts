import { createCookieSessionStorage } from 'react-router'
import { environment } from './environment'

type SessionData = {
	userId: string
}

const sessionStorage = createCookieSessionStorage<SessionData>({
	cookie: {
		name: '__session',
		sameSite: 'lax',
		path: '/',
		httpOnly: true,
		secrets: [environment.COOKIE_SECRET],
		secure: environment.NODE_ENV === 'production',
	},
})

export { sessionStorage }
