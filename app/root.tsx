import { type LoaderFunctionArgs, type LinksFunction, type MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import { authenticator } from '~/services/identity.server'
import stylesheet from '~/tailwind.css'

const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

const meta: MetaFunction = () => {
  return [{ title: 'Scoreboard' }]
}

async function loader({ request }: LoaderFunctionArgs) {
  if (request.url.toLowerCase().includes('/login')) return null
  return await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  })
}

function App() {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export { links, loader, meta }
export default App
