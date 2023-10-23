import { type LoaderFunctionArgs, type LinksFunction, type MetaFunction, json } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react'
import { Analytics } from '@vercel/analytics/react'
import { environment } from '~/services/environment.server'
import { identity } from '~/services/identity.server'
import stylesheet from '~/tailwind.css'

const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

const meta: MetaFunction = () => {
  return [{ title: 'Scoreboard' }]
}

async function loader({ request }: LoaderFunctionArgs) {
  const { pathname } = new URL(request.url.toLowerCase())
  if (pathname !== '/login' && pathname !== '/login/') {
    await identity.isAuthenticated(request, {
      failureRedirect: '/login',
    })
  }
  return json({ ENV: { VERCEL_ANALYTICS_ID: environment.VERCEL_ANALYTICS_ID } })
}

function App() {
  const { ENV } = useLoaderData<typeof loader>()
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
        <Analytics />
        <script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(ENV)}` }} />
      </body>
    </html>
  )
}

export { links, loader, meta }
export default App
