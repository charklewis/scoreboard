import { Avatar, AvatarGroup } from '@nextui-org/react'

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
        <Avatar
          key={player.id}
          showFallback
          size="sm"
          classNames={{ base: player.background }}
          fallback={<dd className="text-xl">{player.emoji}</dd>}
        />
      ))}
    </AvatarGroup>
  )
}

export { Players }
