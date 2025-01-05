import * as stytch from 'stytch'

import { environment } from './environment'

const client = new stytch.Client({ project_id: environment.STYTCH_PROJECT_ID, secret: environment.STYTCH_SECRET })

async function sendOtpByEmail(email: string) {
  let failed = { error: true, noAccount: false, message: '' }
  try {
    const response = await client.otps.email.send({ email })
    if (response.status_code !== 200) {
      return failed
    }
    return response.email_id || failed
  } catch (error) {
    if (error instanceof stytch.StytchError) {
      if (error.error_type === 'inactive_email') {
        return {
          error: true,
          noAccount: false,
          message:
            'Your email might be blocked by your provider. Please check your email settings to ensure it’s allowed.',
        }
      }
      if (error.error_type === 'email_not_found') {
        return { error: true, noAccount: true, message: '' }
      }
    }
  }
  return failed
}

async function createUserByEmail(email: string) {
  let failed = { error: true, message: '' }
  try {
    const response = await client.otps.email.loginOrCreate({ email })
    if (response.status_code !== 200) {
      return failed
    }
    return response.email_id
  } catch (error) {
    if (error instanceof stytch.StytchError) {
      if (error.error_type === 'inactive_email') {
        return {
          error: true,
          message:
            'Your email might be blocked by your provider. Please check your email settings to ensure it’s allowed.',
        }
      }
    }
  }
  return failed
}

async function verifyOtp(methodId: string, code: string) {
  try {
    const response = await client.otps.authenticate({ method_id: methodId, code: code })
    if (response.status_code !== 200) {
      return false
    }
    return response?.user_id
      ? {
          userId: response.user_id,
          email: response.user?.emails.find((email) => email.email_id === methodId)?.email as string,
        }
      : false
  } catch {}
  return false
}

// async function getUserEmail(stytchId: string) {
//   try {
//     const response = await client.users.get({ user_id: stytchId })
//     if (response.status_code !== 200) {
//       return ''
//     }
//     return response.emails[0].email || ''
//   } catch {}
//   return ''
// }

// async function updateEmail({ stytchId, email }: { stytchId: string; email: string }) {
//   try {
//     const user = await client.users.get({ user_id: stytchId })
//     if (user.status_code !== 200) {
//       return false
//     }
//     const emailsToDelete = user.emails.filter((item) => item.email !== email)
//     for (const emailToDelete of emailsToDelete) {
//       await client.users.deleteEmail({ email_id: emailToDelete.email_id })
//       //send email that the email was removed https://resend.com
//     }
//     return true
//   } catch {}
//   return false
// }

// class OtpStrategy<User> extends Strategy<User, OtpStrategy.VerifyOptions> {
//   name = 'otp'

//   async authenticate(request: Request): Promise<User> {
//     const validator = withZod(z.object({ methodId: z.string(), code: z.string(), email: z.string().email() }))
//     const result = await validator.validate(await request.formData())
//     if (result.error) {
//       const cause = `${result.submittedData.methodId}:${result.submittedData.email}`
//       throw new Error('We are having issues verifying your information', { cause })
//     }
//     return await this.verify({ code: result.data.code, methodId: result.data.methodId })
//   }
// }

// const identity = new Authenticator<User>()

// identity.use(
//   new OtpStrategy(async ({ code, methodId }) => {
//     // const stytchId = await authenticateOtp({ methodId, code })
//     // if (!stytchId) throw new Error('Your code was not valid')

//     // const user = await createUser(stytchId)
//     // if (!user) throw new Error('We are having issues verifying your account')

//     const stytchId = '123'

//     return { stytchId }
//   })
// )

export { sendOtpByEmail, createUserByEmail, verifyOtp }
