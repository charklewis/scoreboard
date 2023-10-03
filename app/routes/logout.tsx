import { type LoaderFunctionArgs } from '@remix-run/node'
import { identity } from '~/services/identity.server'

async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.toLowerCase().includes('/login')) return null
  return await identity.logout(request, { redirectTo: '/login' })
}

export { loader }
