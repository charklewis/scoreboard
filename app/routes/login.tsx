import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'
import { string } from 'zod'

import { LoadingButton, TextButton } from '~/components/button'
import { ErrorMessage, Form, InputGroup, OtpInput } from '~/components/form'
import { TextField } from '~/components/form/text-field'
import { authenticator, sendOtp } from '~/services/identity.server'

async function action({ request }: ActionFunctionArgs) {
  return namedAction(request, {
    async signIn() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const methodId = await sendOtp(email)
        if (methodId) {
          return json({ methodId, email })
        }
        return json({ errors: { email: 'An error occured while verifying your email, please try again later' } })
      } catch {
        return json({ errors: { email: 'An email is required' } })
      }
    },
    async otp() {
      try {
        return await authenticator.authenticate('otp', request, {
          successRedirect: '/dashboard',
          failureRedirect: '/login',
        })
      } catch (error) {
        //this is the successful redirect
        if (error instanceof Response) throw error
        //otherwise handle the error
        if (error instanceof Error) {
          return json({ methodId: error.cause, errors: { code: error.message } })
        }
        return json({ errors: { generic: 'Our system appears to be down, please try again later' } })
      }
    },
    async resend() {
      return json({})
    },
  })
}

function SignIn() {
  const { errors } = useActionData<{ errors?: { email: string; generic?: string } }>() || {}
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="login" action="?/signIn" errors={errors} className="space-y-6">
          <InputGroup name="email">
            <TextField label={{ children: 'Email' }} input={{ type: 'email' }} />
          </InputGroup>
          {errors?.generic ? (
            <p className="mt-2 text-sm text-red-600" data-testid="error-message-generic">
              {errors.generic}
            </p>
          ) : null}
          <LoadingButton variant="primary" type="submit" text="Sign in" loadingText="Signing in..." />
        </Form>
      </div>
    </>
  )
}

function OneTimeCode({ methodId }: { methodId: string }) {
  const { errors } = useActionData<{ errors?: { code: string } }>() || {}
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verification</h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="otp" action="?/otp" className="space-y-6" errors={errors}>
          <input type="hidden" name="methodId" value={methodId} />
          <p className="text-center">Enter your OTP code</p>
          <InputGroup name="code">
            <OtpInput />
            <ErrorMessage />
          </InputGroup>
          <LoadingButton variant="primary" type="submit" text="Verify" loadingText="Verifying..." />
        </Form>
        <div className="w-full border-t border-gray-200" />
        <Form id="otp-resend" action="?/resend" className="space-y-6">
          <input type="hidden" name="methodId" value={methodId} />
          <TextButton variant="secondary" type="submit" text="Resend new code" loadingText="Sending..." />
        </Form>
      </div>
    </>
  )
}

function Login() {
  const { methodId } = useActionData<{ methodId?: string }>() || {}

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {methodId ? <OneTimeCode methodId={methodId} /> : <SignIn />}
      </div>
    </main>
  )
}

export { action }
export default Login
