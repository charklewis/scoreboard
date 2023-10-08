import { useActionData } from '@remix-run/react'

import { LoadingSolidButton } from '~/components/button'
import { Form, InputGroup } from '~/components/form'
import { TextField } from '~/components/form/text-field'

function SignIn() {
  const { errors } = useActionData<{ errors?: { email: string; generic?: string } }>() || {}
  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-neutral-900">
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
          <LoadingSolidButton id="sign-in" type="submit" text="Sign in" loadingText="Signing in..." />
        </Form>
      </div>
    </>
  )
}

export { SignIn }
