import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useActionData, useNavigation } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'
import { string } from 'zod'

import { LoadingSolidButton, LoadingTextButton } from '~/components/button'
import { ErrorMessage, Form, InputGroup, OtpInput } from '~/components/form'
import { TextField } from '~/components/form/text-field'
import { identity, loginWithOtp } from '~/services/identity.server'

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

function SignIn() {
  const { errors } = useActionData<{ errors?: { email: string; generic?: string } }>() || {}
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="login" action="?/sendOtp" errors={errors} className="space-y-6">
          <InputGroup name="email">
            <TextField label="Email" input={{ type: 'email' }} />
          </InputGroup>
          {errors?.generic ? (
            <p className="mt-2 text-sm text-red-600" data-testid="error-message-generic">
              {errors.generic}
            </p>
          ) : null}
          <LoadingSolidButton id="sign-ign" type="submit" text="Sign in" loadingText="Signing in..." />
        </Form>
      </div>
    </>
  )
}

function OneTimeCode({ methodId, email }: { methodId: string; email?: string }) {
  const { errors, sent } = useActionData<{ errors?: { code: string }; sent: string }>() || {}
  const navigation = useNavigation()
  const isLoading = navigation.state !== 'idle'
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verification</h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="otp" action="?/verifyOtp" className="space-y-6" errors={errors}>
          <input type="hidden" name="methodId" value={methodId} />
          <input type="hidden" name="email" value={email} />
          <p className="text-center">Enter your OTP code</p>
          <InputGroup name="code">
            <OtpInput />
            <ErrorMessage />
          </InputGroup>
          <LoadingSolidButton id="submit-otp" type="submit" text="Verify" loadingText="Verifying..." />
        </Form>
        <div className="w-full border-t border-gray-200" />
        <Form id="otp-resend" action="?/resendOtp" className="space-y-6">
          <input type="hidden" name="email" value={email} />
          <div>
            <LoadingTextButton
              id="resend-otp"
              variant="secondary"
              type="submit"
              text="Resend new code"
              loadingText="Sending..."
            />
            {!isLoading && sent ? (
              <p className="text-center text-xs text-gray-600">Sent: {new Date(sent).toLocaleString()}</p>
            ) : null}
          </div>
        </Form>
      </div>
    </>
  )
}

function Login() {
  const { methodId, email } = useActionData<{ methodId?: string; email?: string }>() || {}

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {methodId ? <OneTimeCode methodId={methodId} email={email} /> : <SignIn />}
      </div>
    </main>
  )
}

export { action }
export default Login
