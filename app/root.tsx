import { type LinksFunction, type LoaderFunctionArgs, type MetaFunction, json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { NextUIProvider } from '@nextui-org/react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'

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
  const navigate = useNavigate()
  const { ENV } = useLoaderData<typeof loader>()

  // only applying suppressHydrationWarning due to ThemeProvider changing HTML class name on hydration
  // look at updating to something like https://www.youtube.com/watch?v=UND-kib_iw4
  return (
    <html lang="en" className="h-full bg-background text-foreground" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <NextUIProvider className="h-full" navigate={navigate}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Outlet />
          </ThemeProvider>
        </NextUIProvider>
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
