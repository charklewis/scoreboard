import { describe, expect, test } from 'vitest'
import { loader } from '~/routes/_index'

describe('loader', () => {
  test('it always redirects to dashboard', async () => {
    const response = await loader()
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('/dashboard')
  })
})
