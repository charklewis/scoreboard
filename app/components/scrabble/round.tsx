import { useFetcher } from '@remix-run/react'
import { useEffect, useMemo } from 'react'
import { Avatar, Card, CardBody, CardHeader } from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { ToastContainer, toast } from 'react-toastify'
import { useDebouncedCallback } from 'use-debounce'

import { Form, Input, InputGroup } from '~/components/form'

type RoundType = {
  id: string
  roundNumber: number
  roundCompleted: boolean
  players: {
    id: string
    name: string
    background: string
    emoji: string
    score: number
    totalScore: number
  }[]
}

function Round({ round }: { round: RoundType }) {
  const save = useFetcher<{ error: string; success: boolean }>()
  const { systemTheme } = useTheme()

  const saveFormValues = useDebouncedCallback(
    (players) => save.submit({ players }, { action: '?/saveRound', method: 'POST' }),
    500
  )

  const defaultValues = useMemo(
    () => round.players.reduce((values, player) => ({ ...values, [player.id]: player.score }), {}),
    [round.players]
  )

  const onChange = () => {
    const element = document.getElementById(`round-${round.roundNumber}`) as HTMLFormElement
    const formData = new FormData(element)
    const values = Object.fromEntries(formData.entries())
    const players = Object.entries(values).map(([id, score]) => ({
      roundId: round.id,
      playerId: id,
      score: Number(score),
    }))
    saveFormValues(JSON.stringify(players))
  }

  useEffect(() => {
    const data = save.data
    if (!data) return
    if (data.error) {
      toast.error(data.error)
    }
    if (data.success) {
      toast.success('Score saved')
    }
  }, [save.data])

  return (
    <Form id={`round-${round.roundNumber}`} defaultValues={defaultValues}>
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {round.players.map((player) => (
          <Card key={player.id} data-testid={`round-player-${player.id}`}>
            <CardHeader className="flex gap-3">
              <Avatar
                showFallback
                size="lg"
                className={player.background}
                fallback={
                  <div className="text-4xl" data-testid={`player-${player.id}`}>
                    {player.emoji}
                  </div>
                }
              />
              <div className="flex flex-col">
                <p className="text-md">{player.name}</p>
                <p className="text-small text-default-500" data-testid={`player-${player.id}-total-score`}>
                  Score {player.totalScore}
                </p>
              </div>
            </CardHeader>
            <CardBody>
              <InputGroup name={player.id}>
                <Input
                  placeholder="Score"
                  size="lg"
                  labelPlacement="inside"
                  type="number"
                  onChange={onChange}
                  onWheel={(event) => event.currentTarget.blur()}
                  step={1}
                />
              </InputGroup>
            </CardBody>
          </Card>
        ))}
      </ul>
      <ToastContainer
        theme={systemTheme}
        position="bottom-right"
        hideProgressBar={true}
        stacked={true}
        autoClose={2000}
        closeButton={false}
      />
    </Form>
  )
}

export { type RoundType, Round }
