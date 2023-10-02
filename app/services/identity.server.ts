import { type SessionStorage } from '@remix-run/node'
import { type AuthenticateOptions, Authenticator, Strategy } from 'remix-auth'
import * as stytch from 'stytch'
import { string } from 'zod'
import { createUser } from '~/database/user'
import { sessionStorage } from '~/services/session.server'
import { environment } from './environment.server'

type User = { stytchId: string }

const client = new stytch.Client({
  project_id: environment.STYTCH_PROJECT_ID,
  secret: environment.STYTCH_SECRET,
})

async function authenticateOtp({ methodId, code }: { methodId: string; code: string }) {
  try {
    const response = await client.otps.authenticate({ method_id: methodId, code: code })
    if (response.status_code !== 200) {
      return false
    }
    return response.user_id || false
  } catch {}
  return false
}

async function sendOtp(email: string) {
  try {
    const response = await client.otps.email.loginOrCreate({ email: email })
    if (response.status_code !== 200) {
      return false
    }
    return response.email_id || false
  } catch {}
  return false
}

class OtpStrategy extends Strategy<User, { code: string; methodId: string }> {
  name = 'otp'
  async authenticate(request: Request, sessionStorage: SessionStorage, options: AuthenticateOptions): Promise<User> {
    const formData = await request.formData()
    const code = string().parse(formData.get('code'))
    const methodId = string().parse(formData.get('methodId'))

    try {
      const user = await this.verify({ code, methodId })
      return this.success(user, request, sessionStorage, options)
    } catch (error) {
      throw new Error((error as Error)?.message || 'Unknown error', { cause: methodId })
    }
  }
}

const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(
  new OtpStrategy(async ({ code, methodId }) => {
    const stytchId = await authenticateOtp({ methodId, code })
    if (!stytchId) {
      throw new Error('Your code was not valid')
    }

    const user = await createUser(stytchId)

    if (!user) {
      throw new Error('We are having issues verifying your account')
    }

    return { stytchId }
  })
)

export { authenticator, sendOtp, authenticateOtp }