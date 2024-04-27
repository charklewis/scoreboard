import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from '@remix-run/react'
import { NextUIProvider } from '@nextui-org/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/remix'
import { ThemeProvider } from 'next-themes'

import { identity } from '~/services/identity.server'

import 'react-toastify/dist/ReactToastify.min.css'
import '~/tailwind.css'

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
  return null
}

function App() {
  const navigate = useNavigate()

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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export { loader, meta }
export default App
