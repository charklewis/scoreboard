import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { data, Form, useLoaderData, useNavigation, useParams } from 'react-router'
import { type Route } from '+routes/dashboard/players/+types/player'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { fetchPlayer } from '~/database/player'
import { cn } from '~/lib/utils'
import { decode } from '~/services/public-ids'
import { sessionStorage } from '~/services/session'

async function loader({ request, params }: Route.LoaderArgs) {
  let session = await sessionStorage.getSession(request.headers.get('cookie'))
  let user = session.get('userId') as string
  const player = await fetchPlayer(user, decode(params.playerId))
  return data(player)
}

function Player() {
  const player = useLoaderData<typeof loader>()
  if (!player)
    return (
      <div className="flex items-center justify-center font-semibold text-neutral-400 dark:text-neutral-700">
        No Player found
      </div>
    )
  return (
    <main className="p-4">
      <h1 className="font-medium">Player</h1>
      <div className="flex items-center gap-2 py-3">
        <span className={cn(player.background, 'flex h-10 w-10 items-center justify-center rounded-full text-2xl')}>
          {player.emoji}
        </span>{' '}
        {player.name}
      </div>
      <div className="my-4 w-full border-b border-neutral-100 dark:border-neutral-800" />
      <DeletePlayer />
    </main>
  )
}

function DeletePlayer() {
  const { playerId } = useParams()
  const [open, setOpen] = useState(false)
  const action = `/dashboard/players/${playerId}/remove-player`
  const navigation = useNavigation()
  const isLoading = navigation.formAction === action
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" className="text-sm">
          Delete Player
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this player? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Form action={action} method="post">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Removing
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </Form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { loader }
export default Player
