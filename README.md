### Todo

- Add prevention to continuously spam login API (eg fail after 3 attempts, then block them from attempting for 5 minutes)

### General

- I would like to use `Dialog` (or similar component) from react-aria for the sidebar nav, however the API requires the dialog and button to live in the same component which is not possible with the current design. So, for now, I am using headless-ui
- We can use [sonner](https://sonner.emilkowal.ski/getting-started) for a toast library

### Testing

- I am currently using vitest while waiting for `bun:test` to have enough parity with `jest`
- I have had to set `"module": "ESNext"` in `tsconfig.json` to get `cypress` to work
- I had to add `resize-observer-polyfill` to get Transition & Dialog from headlessui to work in react testing library

### Bugs

- `vitest` does can not find any test when running in lint-staged so I have skipped it
- `typecheck` does not work properly in lint-staged so I have skipped it
- `prettier` conflicts with some eslint rules so I have skipped it in lint-staged


//set up github 1password integration https://developer.1password.com/docs/ssh/get-started/