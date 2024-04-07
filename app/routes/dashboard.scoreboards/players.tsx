import { Avatar, AvatarGroup, Tooltip } from '@nextui-org/react'

type Player = {
  id: string
  name: string
  background: string
  emoji: string
}

function Players({ players }: { players: Player[] }) {
  return (
    <AvatarGroup isBordered max={5}>
      {players.map((player) => (
        <Tooltip content={player.name} key={player.id} size="sm" placement="bottom">
          <Avatar
            showFallback
            size="sm"
            classNames={{ base: player.background }}
            fallback={
              <dd className="text-xl" data-testid={`player-${player.id}`}>
                {player.emoji}
              </dd>
            }
          />
        </Tooltip>
      ))}
    </AvatarGroup>
  )
}

export { Players }
