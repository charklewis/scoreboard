import { useTooltip, useTooltipTrigger } from '@react-aria/tooltip'
import { useRef, type ReactNode } from 'react'
import { type TooltipTriggerState, useTooltipTriggerState } from 'react-stately'

type PlayerType = {
  id: string
  name: string
  background: string
  emoji: string
}

function Tooltip({ state, children }: { children: ReactNode; state: TooltipTriggerState }) {
  const { tooltipProps } = useTooltip({}, state)

  console.log({ tooltipProps })

  return (
    <span
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-md bg-white p-2 text-xs text-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5"
      {...tooltipProps}
    >
      {children}
    </span>
  )
}

function Player({ player }: { player: PlayerType }) {
  const delay = 100
  const closeDelay = 50
  const state = useTooltipTriggerState({ delay, closeDelay })
  const ref = useRef(null)

  const { triggerProps, tooltipProps } = useTooltipTrigger({ delay, closeDelay }, state, ref)

  return (
    <span data-testid={`player-${player.id}`} style={{ position: 'relative' }}>
      <dd ref={ref} {...triggerProps}>
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white"
          style={{ backgroundColor: player.background }}
        >
          <div className="text-sm">{player.emoji}</div>
        </div>
      </dd>

      {state.isOpen ? (
        <Tooltip state={state} {...tooltipProps}>
          {player.name}
        </Tooltip>
      ) : null}
    </span>
  )
}

export { Player }
