import { json, type ActionFunctionArgs } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { namedAction } from 'remix-utils/named-action'

import { LoadingPrimaryButton, TextSecondaryButton } from '~/components/button'
import { Form, InputGroup, OtpInput } from '~/components/form'
import { TextField } from '~/components/form/text-field'

async function action({ request }: ActionFunctionArgs) {
  const test = new Promise(function (resolve) {
    setTimeout(resolve, 5000)
  })

  await Promise.all([test])

  return namedAction(request, {
    async signIn() {
      //fix with zod
      const body = await request.formData()
      const email = body.get('email') as string
      return json({ methodId: 'abc', email })
    },
    async otp() {
      return json({ methodId: 'abc', email: '' })
    },
    async resend() {
      return json({ methodId: 'abc', email: '' })
    },
  })
}

function SignIn() {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="login" action="?/signIn" className="space-y-6">
          <InputGroup name="email">
            <TextField label={{ children: 'Email' }} input={{ type: 'email' }} />
          </InputGroup>
          <LoadingPrimaryButton type="submit" text="Sign in" loadingText="Signing in..." />
        </Form>
      </div>
    </>
  )
}

function OneTimeCode({ email, methodId }: { email: string; methodId: string }) {
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Verification</h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="otp" action="?/otp" className="space-y-6">
          <input type="hidden" name="methodId" value={methodId} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="code" value={email} />
          <p className="text-center">Enter your OTP code</p>
          <InputGroup name="code">
            <OtpInput />
          </InputGroup>
          <LoadingPrimaryButton type="submit" text="Verify" loadingText="Verifying..." />
        </Form>
        <div className="w-full border-t border-gray-200" />
        <Form id="otp-resend" action="?/resend" className="space-y-6">
          <input type="hidden" name="methodId" value={methodId} />
          <input type="hidden" name="email" value={email} />
          <TextSecondaryButton text="Resend new code" loadingText="Sending..." />
        </Form>
      </div>
    </>
  )
}

function Login() {
  const { email, methodId } = useActionData<typeof action>() || {}

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {email && methodId ? <OneTimeCode email={email} methodId={methodId} /> : <SignIn />}
        {/* <OneTimeCode email={email} methodId={methodId} /> */}
      </div>
    </main>
  )
}

export { action }
export default Login
