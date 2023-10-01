import * as stytch from 'stytch'
import { environment } from './environment.server'

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

async function sendOtp({ email }: { email: string }) {
  try {
    const response = await client.otps.email.loginOrCreate({ email: email })
    if (response.status_code !== 200) {
      return false
    }
    return response.email_id || false
  } catch {}
  return false
}

export { authenticateOtp, sendOtp }
