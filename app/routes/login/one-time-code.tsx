import { useActionData, useNavigation } from '@remix-run/react'

import { Button, ErrorMessage, Form, InputGroup, OtpInput } from '~/components/form'

function OneTimeCode() {
  const { errors, methodId, email, sent } =
    useActionData<{ errors?: { code: string }; email: string; methodId: string; sent: string }>() || {}
  const navigation = useNavigation()
  const isLoading = navigation.state !== 'idle'

  return (
    <>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">Verification</h2>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Form id="otp" action="?/verifyOtp" className="space-y-6" errors={errors}>
          <input type="hidden" name="methodId" value={methodId} />
          <input type="hidden" name="email" value={email} />
          <p className="text-center">Enter your OTP code</p>
          <InputGroup name="code">
            <OtpInput />
            <ErrorMessage />
          </InputGroup>
          <Button
            id="submit-otp"
            type="submit"
            text="Verify"
            loadingText="Verify..."
            color="primary"
            className="w-full"
          />
        </Form>

        <Form id="otp-resend" action="?/resendOtp" className="space-y-3">
          <input type="hidden" name="email" value={email} />
          <div>
            <Button
              id="resend-otp"
              type="submit"
              variant="light"
              text="Resend new code"
              loadingText="Sending..."
              className="w-full"
            />
            {!isLoading && sent ? (
              <p className="mt-4 text-center text-xs text-neutral-600" data-testid="resend-code-timestamp">
                Sent: {new Date(sent).toLocaleString()}
              </p>
            ) : null}
          </div>
        </Form>
      </div>
    </>
  )
}

export { OneTimeCode }
