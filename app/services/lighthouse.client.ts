import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals'

declare global {
  interface Window {
    ENV: { VERCEL_ANALYTICS_ID: string }
  }
}

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

function getConnectionSpeed() {
  const isSupported = !!(navigator as any)?.connection?.effectiveType
  return isSupported ? (navigator as any)?.connection?.effectiveType : ''
}

function sendToAnalytics(metric: Metric) {
  const analyticsId = window?.ENV?.VERCEL_ANALYTICS_ID

  if (!analyticsId) return

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  }

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: 'application/x-www-form-urlencoded',
  })
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob)
  } else
    fetch(vitalsUrl, {
      body: blob,
      method: 'POST',
      credentials: 'omit',
      keepalive: true,
    })
}

function webVitals() {
  try {
    onFID((metric) => sendToAnalytics(metric))
    onTTFB((metric) => sendToAnalytics(metric))
    onLCP((metric) => sendToAnalytics(metric))
    onCLS((metric) => sendToAnalytics(metric))
    onFCP((metric) => sendToAnalytics(metric))
  } catch (err) {
    console.error('[Analytics]', err)
  }
}

export { webVitals }
