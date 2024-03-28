import { useActionData } from '@remix-run/react'

import { Form, InputGroup, NewInput, Button } from '~/components/form'

function SignIn() {
  const { errors } = useActionData<{ errors?: { email: string; generic?: string } }>() || {}

  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Sign in to your account</h2>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="login" action="?/sendOtp" errors={errors} className="space-y-6">
          <InputGroup name="email">
            <NewInput label="Email" />
          </InputGroup>
          {errors?.generic ? (
            <p className="mt-2 text-sm text-red-600" data-testid="error-message-generic">
              {errors.generic}
            </p>
          ) : null}
          <Button
            id="sign-in"
            type="submit"
            text="Sign in"
            loadingText="Signing in..."
            color="primary"
            className="w-full"
          />
        </Form>
      </div>
    </>
  )
}

export { SignIn }
