import { RemixBrowser } from '@remix-run/react'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { webVitals } from '~/services/lighthouse.client'

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})

webVitals()
