import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'

import { getUserEmail, identity } from '~/services/identity.server'
import { Navbar } from '../../components/navbar'

async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url.toLowerCase())
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return redirect('/dashboard/scoreboards')
  }
  const user = await identity.isAuthenticated(request)
  if (user && user.stytchId) {
    const email = await getUserEmail(user.stytchId)
    return json({ email: email || 'User' })
  } else {
    return json({ email: 'User' })
  }
}

function Dashboard() {
  const { email } = useLoaderData<typeof loader>() || {}
  return (
    <div>
      <Navbar user={email} />
      <main data-testid="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export { loader }
export default Dashboard
