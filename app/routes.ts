import { type RouteConfig, route, index, prefix } from '@react-router/dev/routes'

export default [
	index('routes/index.tsx'),
	route('sign-out', 'routes/sign-out.tsx'),
	...prefix('sign-in', [
		index('routes/sign-in/index.tsx'),
		route('new-account', 'routes/sign-in/new-account.tsx'),
		route('otp', 'routes/sign-in/otp.tsx'),
	]),
] satisfies RouteConfig
