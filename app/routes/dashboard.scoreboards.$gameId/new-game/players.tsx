import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { ArrowDownIcon, ArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'

import { getOrdinalSuffix } from '~/components/helpers'

import { type Player as PlayerType } from '../api.server'

const columns = [
  { key: 'player', label: 'Player' },
  { key: 'order', label: 'Order' },
  { key: 'action', label: '' },
]

function Players({
  players,
  removePlayer,
  movePlayer,
}: {
  players: PlayerType[]
  removePlayer: (id: string) => void
  movePlayer: (id: string, direction: 'up' | 'down') => void
}) {
  const rows = players.map((player, index) => ({ ...player, index }))
  const renderCell = (player: (typeof rows)[0], columnKey: string) => {
    const getDisabledKeys = () => {
      const keys = []
      if (player.index === 0) {
        keys.push('move-up')
      }
      if (player.index === players.length - 1) {
        keys.push('move-down')
      }
      return keys
    }
    switch (columnKey) {
      case 'player':
        return (
          <div className="flex w-full items-center gap-2">
            <Avatar
              showFallback
              size="sm"
              className={player.background}
              fallback={<div className="text-2xl">{player.emoji}</div>}
            />
            <p>{player.name}</p>
          </div>
        )
      case 'order':
        return (
          <p>
            {player.index + 1}
            {getOrdinalSuffix(player.index + 1)}
          </p>
        )
      case 'action':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                data-testid={`button-player-options-${player.id}`}
                aria-label="Options"
              >
                <EllipsisVerticalIcon className="size-5" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="flat" disabledKeys={getDisabledKeys()} aria-label="Option">
              <DropdownItem
                key="move-up"
                onClick={() => movePlayer(player.id, 'up')}
                data-testid={`button-move-up-player-${player.id}`}
                startContent={<ArrowUpIcon className="size-3" />}
              >
                Move Up
              </DropdownItem>
              <DropdownItem
                key="move-down"
                onClick={() => movePlayer(player.id, 'down')}
                data-testid={`button-move-down-player-${player.id}`}
                startContent={<ArrowDownIcon className="size-3" />}
                showDivider
              >
                Move Down
              </DropdownItem>
              <DropdownItem
                color="danger"
                key="remove"
                onClick={() => removePlayer(player.id)}
                data-testid={`button-remove-player-${player.id}`}
                startContent={<XMarkIcon className="size-4" />}
              >
                Remove Player
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )
      default:
        return null
    }
  }
  return (
    <Table
      aria-label="selected-players"
      data-testid="container-selected-players"
      fullWidth
      className="mt-8"
      shadow="sm"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} width={column.key === 'player' ? '100%' : null}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={rows} emptyContent="No players selected">
        {(row) => (
          <TableRow key={row.id}>{(columnKey) => <TableCell>{renderCell(row, String(columnKey))}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export { Players }
