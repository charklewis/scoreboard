import { createCookieSessionStorage } from '@remix-run/node'
import { environment } from './environment.server'

const sessionStorage = createCookieSessionStorage({
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
