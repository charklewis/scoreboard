import { type ActionFunctionArgs, json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'
import { string } from 'zod'

import { identity, loginWithOtp } from '~/services/identity.server'

import { OneTimeCode } from './one-time-code'
import { SignIn } from './sign-in'

async function action({ request }: ActionFunctionArgs) {
  return namedAction(request, {
    async sendOtp() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const methodId = await loginWithOtp(email)

        if (methodId) {
          return json({ methodId, email })
        }
        return json({ errors: { email: 'An error occured while verifying your email, please try again later' } })
      } catch {
        return json({ errors: { email: 'An email is required' } })
      }
    },
    async verifyOtp() {
      try {
        return await identity.authenticate('otp', request, {
          successRedirect: '/dashboard',
          failureRedirect: '/login',
        })
      } catch (error) {
        //this is the successful redirect
        if (error instanceof Response) throw error
        //otherwise handle the error
        if (error instanceof Error) {
          const [methodId, email] = (error.cause as string).split(':')
          return json({ methodId, email, errors: { code: error.message } })
        }
        return json({ errors: { generic: 'Our system appears to be down, please try again later' } })
      }
    },
    async resendOtp() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const methodId = await loginWithOtp(email)
        if (methodId) {
          return json({ methodId, email, sent: new Date() })
        }
        return json({ errors: { email: 'An error occured while resending a new code, please try again later' } })
      } catch {
        return json({ errors: { email: 'An email is required' } })
      }
    },
  })
}

function Login() {
  const { methodId } = useActionData<{ methodId?: string }>() || {}

  return (
    <section className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">{methodId ? <OneTimeCode /> : <SignIn />}</div>
    </section>
  )
}

export { action }
export default Login
