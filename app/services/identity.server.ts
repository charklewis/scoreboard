import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { z } from 'zod'
import { getOrCreateUser } from '~/database/user'
import { sessionStorage } from '~/services/session.server'
import { authenticateOtp } from './stytch.server'

type User = { stytchId: string }

const authenticator = new Authenticator<User>(sessionStorage)

// The rest of the code above here...

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const code = z.string().parse(form.get('code'))
    const methodId = z.string().parse(form.get('methodId'))

    try {
      const stytchId = await authenticateOtp({ methodId, code })
      if (!stytchId) {
        throw new Error('Could not authenticate code')
      }

      const user = await getOrCreateUser(stytchId)
      if (!user) {
        throw new Error('Could not find or create user')
      }

      return { stytchId }
    } catch {
      throw new Error('Unknown error')
    }
  })
)

export { authenticator }
