import { faker } from '@faker-js/faker'
import { isValidationErrorResponse, useForm, validationError } from '@rvf/react-router'
import { withZod } from '@rvf/zod'
import { LoaderCircle } from 'lucide-react'
import { Form, useActionData, data, useLoaderData, redirect } from 'react-router'
import { z } from 'zod'
import { type Route } from '+routes/dashboard/players/+types/add-player'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { ColorPicker } from '~/components/ui/color-picker'
import { EmojiPicker } from '~/components/ui/emoji-picker'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { insertPlayer } from '~/database/player'
import { color, emoji } from '~/database/static'
import { useToast } from '~/hooks/use-toast'
import { encode } from '~/services/public-ids'
import { sessionStorage } from '~/services/session'

type Color = keyof typeof color
type Emoji = keyof typeof emoji

const formId = 'add-player'
const colors = Object.entries(color).map(([name, value]) => ({ name: name, ...value }))
const emojis = Object.entries(emoji).map(([name, value]) => ({ name: name, value }))

const validator = withZod(
  z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    color: z.string().min(1, { message: 'Background color is required' }),
    emoji: z.string({ message: 'Emoji is required' }),
  }),
)

async function action({ request }: Route.ActionArgs) {
  const form = await request.formData()
  const result = await validator.validate(form)
  if (result.error) return validationError(result.error)
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId') as string
  const response = await insertPlayer(user, result.data)
  if (response) {
    return redirect(`/dashboard/players/${encode(response)}`)
  }
  return validationError({ formId, fieldErrors: { name: 'We couldn’t create the player. Please try again.' } })
}

async function loader() {
  return data({ color: faker.helpers.arrayElement(colors).name, emoji: faker.helpers.arrayElement(emojis).name })
}

function AddPlayer() {
  const { toast } = useToast()
  const data = useActionData<typeof action>()
  const defaultValues = useLoaderData<typeof loader>()
  const form = useForm({
    id: formId,
    method: 'post',
    defaultValues: {
      name: '',
      color: defaultValues.color,
      emoji: defaultValues.emoji,
    },
    validator,
    onSubmitSuccess: () => {
      if (isValidationErrorResponse(data)) return
      form.resetForm()
    },
    onSubmitFailure() {
      const description = form.error('name')
      toast({ title: 'Player Not Created', description, variant: 'destructive' })
    },
    onInvalidSubmit() {
      const description = form.error('name')
      toast({ title: 'Player Not Created', description, variant: 'destructive' })
    },
  })

  const isLoading = form.formState.isSubmitting

  return (
    <main className="p-4">
      <h1 className="font-medium">Create New Player</h1>
      <Form {...form.getFormProps()} className="mt-4 space-y-8">
        <div className="flex items-end gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className={color[form.field('color').value() as Color].bgColor}>
              <div className="text-4xl">{emoji[form.field('emoji').value() as Emoji]}</div>
            </AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input {...form.getInputProps('name')} className="mt-2 w-auto" id="name" required />
          </div>
        </div>

        <Button type="submit" className="my-4" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="animate-spin" /> Creating
            </>
          ) : (
            'Add Player'
          )}
        </Button>

        <div className="w-full border-b border-neutral-100 dark:border-neutral-800" />

        <ColorPicker {...form.getInputProps('color')} setValue={form.field('color').setValue} />
        <EmojiPicker {...form.getInputProps('emoji')} setValue={form.field('emoji').setValue} />
      </Form>
    </main>
  )
}

export { loader, action }
export default AddPlayer
