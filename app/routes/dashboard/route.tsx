import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { Navbar } from './navbar'

function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url.toLowerCase())
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return redirect('/dashboard/scoreboards')
  }
  return null
}

function Dashboard() {
  return (
    <div>
      <Navbar />
      <main data-testid="dashboard-content">
        <Outlet />
      </main>
    </div>
  )
}

export { loader }
export default Dashboard
