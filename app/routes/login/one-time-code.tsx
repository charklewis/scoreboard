import { useActionData, useNavigation } from '@remix-run/react'

import { LoadingSolidButton, LoadingTextButton } from '~/components/button'
import { ErrorMessage, Form, InputGroup, OtpInput } from '~/components/form'

function OneTimeCode() {
  const { errors, methodId, email, sent } =
    useActionData<{ errors?: { code: string }; email: string; methodId: string; sent: string }>() || {}
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

export { OneTimeCode }
