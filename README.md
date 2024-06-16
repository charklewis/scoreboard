### Todo

- Add prevention to continuously spam login API (eg fail after 3 attempts, then block them from attempting for 5 minutes)

### Notes

- The app can not be upgrade to node 20 in vercel deployments. The connection to neon DB via drizzle fails. It works locally without any issues. In vercel environment it fails every connection with "socket hang up".
- I am currently using vitest while waiting for `bun:test` to have enough parity with `jest`.
- The package `@nextui-org/react` can not be upgrade past `2.4.0` due to issues with vercel deployments. This upgrade works without issues locally. In vercel the build fails due to incorrectly identifying exports with react-aria missing.
- There is currently a bug with NextUI form components that do not allow them to become not invalid once valid. This prevents a user from typing in the correct value after they have typed in a incorrect one. The `NextUIProvider` component provides a validationBehavior prop is supposed to fix this behavior, but as of `2.4.0` it does not. To fix this I have removed using the `isValid` and `errorMessage` prop from the form NextUI components.
