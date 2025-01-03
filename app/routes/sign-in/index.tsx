import { Dices, LoaderCircle, PenLine } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { data, Form, redirect, useActionData } from 'react-router'
import { withZod } from '@rvf/zod'
import { isValidationErrorResponse, useForm, validationError } from '@rvf/react-router'
import { z } from 'zod'
import { useToast } from '~/hooks/use-toast'
import { sendOtpByEmail } from '~/services/identity'
import type { Route } from './+types/index.ts'
import { sessionStorage } from '~/services/session'
import { encodeBase64 } from '~/services/public-ids'

const validator = withZod(
  z.object({
    email: z.string().email({ message: 'The email address you entered isn’t valid. Please check and try again.' }),
  })
)

const formId = 'sign-in'

function meta({}: Route.MetaArgs) {
  return [
    { title: 'Scoreboard' },
    {
      name: 'description',
      content:
        'Scoreboard is the ultimate digital scorekeeper for Scrabble and other games. Track scores, save results, and share your gameplay easily. Start tracking today!',
    },
  ]
}

async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const result = await validator.validate(form)
  if (result.error) return validationError(result.error)
  const response = await sendOtpByEmail(result.data.email)
  if (typeof response === 'string') {
    return redirect(`/sign-in/otp?emailId=${encodeBase64(response)}`)
  }
  if (response.noAccount) {
    return redirect(`/sign-in/new-account?email=${result.data.email}`)
  }
  return validationError({ formId, fieldErrors: { email: response.message } })
}

async function loader({ request }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId')
  if (user) throw redirect('/dashboard')
  return data(null)
}

function SignIn() {
  const { toast } = useToast()
  const data = useActionData<typeof action>()
  const form = useForm({
    id: formId,
    method: 'post',
    action: '/sign-in',
    validator,
    onSubmitSuccess: () => {
      if (isValidationErrorResponse(data)) return
      form.resetForm()
    },
    onSubmitFailure() {
      const description = form.error('email') || 'Please check your credentials and try again.'
      toast({
        title: 'Sign-In Failed',
        description: description,
        variant: 'destructive',
      })
    },
    onInvalidSubmit() {
      const description = form.error('email')
      toast({ title: 'Invalid Email Address', description, variant: 'destructive' })
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
              </div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input {...form.getInputProps('email')} id="email" type="email" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Loading
                    </>
                  ) : (
                    'Continue'
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

export { action, meta, loader }
export default SignIn
