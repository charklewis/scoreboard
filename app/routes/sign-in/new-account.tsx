import { isValidationErrorResponse, useForm, validationError } from '@rvf/react-router'
import { withZod } from '@rvf/zod'
import { Dices, LoaderCircle, PenLine } from 'lucide-react'
import { data, Form, redirect, useActionData, useSearchParams } from 'react-router'
import { z } from 'zod'
import  { type Route } from './+types/new-account'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useToast } from '~/hooks/use-toast'
import { createUserByEmail } from '~/services/identity'
import { encodeBase64 } from '~/services/public-ids'
import { sessionStorage } from '~/services/session'

const validator = withZod(
	z.object({
		email: z.string().email({ message: 'The email address you entered isn’t valid. Please check and try again.' }),
	}),
)

const formId = 'new-account'

async function action({ request }: Route.ActionArgs) {
	const form = await request.formData()
	const result = await validator.validate(form)
	if (result.error) return validationError(result.error)
	const response = await createUserByEmail(result.data.email)
	if (typeof response === 'string') {
		return redirect(`/sign-in/otp?emailId=${encodeBase64(response)}`)
	}
	return validationError({ formId, fieldErrors: { email: response.message } })
}

async function loader({ request }: Route.LoaderArgs) {
	let session = await sessionStorage.getSession(request.headers.get('cookie'))
	let user = session.get('userId')
	if (user) throw redirect('/dashboard')
	return data(null)
}

function NewAccount() {
	const [searchParams] = useSearchParams()
	const { toast } = useToast()
	const data = useActionData<typeof action>()
	const form = useForm({
		id: formId,
		method: 'post',
		action: '/sign-in/new-account',
		defaultValues: { email: searchParams.get('email') },
		validator,
		onSubmitSuccess: () => {
			if (isValidationErrorResponse(data)) return
			form.resetForm()
		},
		onSubmitFailure() {
			const description = form.error('email') || 'Please check your credentials and try again.'
			toast({
				title: 'Account Creation Failed',
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
								<div className="text-center text-sm">We couldn’t find an account with that information.</div>
							</div>
							<div className="flex flex-col gap-6">
								<div className="grid gap-2">
									<Label htmlFor="email">Email</Label>
									<Input {...form.getInputProps('email')} id="email" type="email" required />
								</div>
								<Button type="submit" className="w-full" disabled>
									{isLoading ? (
										<>
											<LoaderCircle className="animate-spin" /> Loading
										</>
									) : (
										'Create Account'
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
export default NewAccount
