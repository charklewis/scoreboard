import { isValidationErrorResponse, useForm, validationError } from '@rvf/react-router'
import { withZod } from '@rvf/zod'
import { Dices, LoaderCircle, PenLine } from 'lucide-react'
import { data, Form, redirect, useActionData, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import { type Route } from './+types/new-account'
import { Button } from '~/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '~/components/ui/input-otp'
import { ToastAction } from '~/components/ui/toast'
import { createUser } from '~/database/user'
import { useToast } from '~/hooks/use-toast'
import { verifyOtp } from '~/services/identity'
import { decodeBase64 } from '~/services/public-ids'
import { sessionStorage } from '~/services/session'

const validator = withZod(
  z.object({
    code: z.string().min(6, { message: 'The code must be 6 digits. Please check and try again.' }),
    emailId: z.string().min(1, { message: 'An email address is required. Please go back and enter one to continue.' }),
  }),
)

const formId = 'otp'

async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const result = await validator.validate(form)
  if (result.error) return validationError(result.error)

  const response = await verifyOtp(decodeBase64(result.data.emailId), result.data.code)
  if (typeof response === 'string') {
    await createUser(response)
    let session = await sessionStorage.getSession(request.headers.get('cookie'))
    session.set('userId', response)
    throw redirect('/', {
      headers: { 'Set-Cookie': await sessionStorage.commitSession(session) },
    })
  }
  return validationError({ formId, fieldErrors: { emailId: 'We couldn’t verify the code. Please try again.' } })
}

async function loader({ request }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId')
  if (user) throw redirect('/dashboard')
  return data(null)
}

function OneTimePasscode() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const data = useActionData<typeof action>()
  const form = useForm({
    id: formId,
    method: 'post',
    action: '/sign-in/otp',
    defaultValues: { emailId: searchParams.get('emailId'), code: '' },
    validator,
    onSubmitSuccess: () => {
      if (isValidationErrorResponse(data)) return
      form.resetForm()
    },
    onSubmitFailure() {
      const description =
        form.error('emailId') || form.error('code') || 'We couldn’t verify the code. Please try again.'
      toast({
        title: 'Code Verification Failed',
        description: description,
        variant: 'destructive',
        action: form.error('emailId') ? (
          <ToastAction altText="Go Back" onClick={() => navigate('/sign-in')}>
            Go Back
          </ToastAction>
        ) : undefined,
      })
    },
    onInvalidSubmit() {
      const title = form.error('emailId') ? 'Code Verification Failed' : 'Invalid Code'
      const description = form.error('emailId') || form.error('code')
      toast({
        title,
        description,
        variant: 'destructive',
        action: form.error('emailId') ? (
          <ToastAction altText="Go Back" onClick={() => navigate('/sign-in')}>
            Go Back
          </ToastAction>
        ) : undefined,
      })
    },
  })

  const isLoading = form.formState.isSubmitting

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Form {...form.getFormProps()}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <a href="#" className="flex flex-col items-center gap-2 font-medium">
                  <div className="flex items-center justify-center rounded-md">
                    <Dices className="size-6" />
                    <PenLine className="size-6" />
                  </div>
                  <span className="sr-only">Scoreboard.</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Scoreboard</h1>
                <div className="text-center text-sm">Enter the verification code sent to your email to continue.</div>
              </div>
              <input {...form.getInputProps('emailId')} id="emailId" type="hidden" />
              <div className="flex flex-col gap-6">
                <div className="self-center">
                  <InputOTP {...(form.getInputProps('code') as any)} maxLength={6} data-testid="input-code">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Verifying
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export { action, loader }
export default OneTimePasscode
