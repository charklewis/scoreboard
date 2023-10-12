import { faker } from '@faker-js/faker'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Fragment } from 'react'
import { SidebarLink } from '~/components/button'
import { Player } from './player'

function loader() {
  const scoreboards = [
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      title: faker.lorem.word(),
      createdAt: faker.date.past(),
      players: [
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
        {
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          background: faker.color.rgb(),
          emoji: faker.internet.emoji(),
        },
      ],
    },
  ]
  return json(scoreboards)
}

function Scoreboards() {
  const scoreboards = useLoaderData<typeof loader>()

  return (
    <ul className="gay-y-2 h-[calc(100vh-64px)] w-full overflow-y-scroll border-r border-black/5 px-2 lg:w-72">
      {!scoreboards || scoreboards.length === 0 ? (
        <li className="flex h-full items-center justify-center text-sm font-semibold text-neutral-500">
          No Scoreboards
        </li>
      ) : (
        scoreboards.map((scoreboard) => (
          <Fragment key={scoreboard.id}>
            <SidebarLink id={scoreboard.id} href={scoreboard.id}>
              <li className="flex flex-wrap items-center justify-between gap-x-6 py-2">
                <div>
                  <p className="text-sm font-semibold capitalize leading-6 text-neutral-900">{scoreboard.title}</p>
                  <div className="flex items-center gap-x-2 text-xs leading-5 text-neutral-500">
                    <time dateTime={scoreboard.createdAt}>{new Date(scoreboard.createdAt).toDateString()}</time>
                  </div>
                </div>
                <dl className="mt-1 flex w-full flex-none justify-between gap-x-8">
                  <div className="flex -space-x-0.5">
                    <dt className="sr-only">Players</dt>
                    {scoreboard.players.map((player) => (
                      <Player key={player.id} player={player} />
                    ))}
                  </div>
                </dl>
              </li>
            </SidebarLink>
            <div className="border-t border-black/5" />
          </Fragment>
        ))
      )}
    </ul>
  )
}

export { loader }
export default Scoreboards
