import { useCallback, useMemo } from 'react'
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'

import { getOrdinalSuffix } from '~/components/helpers'

import { calculatePlayerScores, convertPlayersToColumns, convertRoundsToRows } from './helpers'
import { type RoundType } from './round'

function Finished({ rounds }: { rounds: RoundType[] }) {
  const players = useMemo(() => calculatePlayerScores(rounds), [rounds])
  const tableColumns = useMemo(() => convertPlayersToColumns(players), [players])
  const tableRows = useMemo(() => convertRoundsToRows(rounds), [rounds])

  const renderCell = useCallback((row: (typeof tableRows)[0], columnKey: string) => {
    const score = row[columnKey as keyof typeof row]
    const testId = `table-rounds-cell-${columnKey}-${score}`
    if (row.winner === columnKey) {
      return (
        <span className="font-medium" data-testid={testId}>
          {score}
        </span>
      )
    }
    return (
      <span className="opacity-75" data-testid={testId}>
        {score}
      </span>
    )
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold capitalize leading-6" data-testid="rounds-title">
        Scrabble
      </h1>
      <ul className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {players.map((player, index) => (
          <Card key={player.id} data-testid={`scores-player-${player.id}`}>
            <CardHeader className="justify-between">
              <div className="flex gap-3">
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
                  <p className="text-small text-default-500" data-testid={`scores-player-${player.id}-total-score`}>
                    Score {player.score}
                  </p>
                </div>
              </div>
              {index === 0 ? (
                <Medal id={player.id} emoji="🥇" />
              ) : index === 1 ? (
                <Medal id={player.id} emoji="🥈" />
              ) : index === 2 ? (
                <Medal id={player.id} emoji="🥉" />
              ) : null}
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="font-medium">
                {index + 1}
                {getOrdinalSuffix(index + 1)} place
              </p>
            </CardBody>
          </Card>
        ))}
      </ul>

      <Divider className="my-6" />

      <p className="text-lg font-semibold capitalize leading-6" data-testid="rounds-table-title">
        Rounds
      </p>

      {rounds.length === 0 ? (
        <p>No rounds have been played</p>
      ) : (
        <Table className="mt-6" fullWidth={false} aria-label="Rounds" data-testid="table-rounds">
          <TableHeader columns={tableColumns}>
            {(column) => (
              <TableColumn data-testid={`table-rounds-header-${column.name}`} key={column.id}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={tableRows}>
            {(row) => (
              <TableRow key={row.id}>
                {(columnKey) => <TableCell>{renderCell(row, String(columnKey))}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

function Medal({ id, emoji }: { id: string; emoji: string }) {
  return (
    <span className="mr-2 text-3xl" data-testid={`player-${id}-medal`}>
      {emoji}
    </span>
  )
}

export { Finished }
