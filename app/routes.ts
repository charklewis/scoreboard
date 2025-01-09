import { type RouteConfig, route, index, prefix, layout } from '@react-router/dev/routes'

export default [
  index('routes/index.tsx'),
  route('sign-out', 'routes/sign-out.tsx'),
  ...prefix('sign-in', [
    index('routes/sign-in/index.tsx'),
    route('new-account', 'routes/sign-in/new-account.tsx'),
    route('otp', 'routes/sign-in/otp.tsx'),
  ]),
  layout('routes/protected.tsx', [
    ...prefix('dashboard', [
      index('routes/dashboard/index.tsx'),
      layout('components/layout/header.tsx', [
        ...prefix('games', [
          index('routes/dashboard/games/index.tsx'),
          route('scrabble', 'routes/dashboard/games/scrabble.tsx'),
        ]),
        route('players', 'routes/dashboard/players/index.tsx', [
          route(':playerId', 'routes/dashboard/players/player.tsx', [
            route('remove-player', 'routes/dashboard/players/remove-player.ts'),
          ]),
          route('add-player', 'routes/dashboard/players/add-player.tsx'),
        ]),
      ]),
    ]),
  ]),
] satisfies RouteConfig
