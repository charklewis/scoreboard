### Testing

- I am currently using vitest while waiting for `bun:test` to have enough parity with `jest`
- I have had to set `"module": "ESNext"` in `tsconfig.json` to get `cypress` to work

### Bugs

- `vitest` does can not find any test when running in lint-staged so I have skipped it
- `typecheck` does not work properly in lint-staged so I have skipped it
- `prettier` conflicts with some eslint rules so I have skipped it in lint-staged
