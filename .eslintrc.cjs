const OFF = 0
const WARN = 1
// const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/internal',
    '@remix-run/eslint-config/jest-testing-library',
    'prettier',
  ],
  ignorePatterns: ['playwright/**', 'playwright-*/**'],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it means we have to explicitly
  // set the jest version.
  settings: {
    'import/internal-regex': '^~/',
    jest: { version: 28 },
  },
  rules: {
    'prefer-let/prefer-let': OFF,
    'prefer-const': WARN,
    'react/jsx-no-leaked-render': [WARN, { validStrategies: ['ternary'] }],
    'jsx-a11y/anchor-has-content': [WARN, { ignoreComponents: ['Link'] }],
    'import/order': [
      WARN,
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [
          { pattern: '@remix-*/**', group: 'external', position: 'before' },
          { pattern: 'react', group: 'external', position: 'before' },
          { pattern: '{react-*/**,react/*}', group: 'external', position: 'before' },
          { pattern: '{nextui/**,@nextui/**}', group: 'external', position: 'before' },
          { pattern: '@heroicons/**', group: 'external', position: 'before' },
          { pattern: 'vitest', group: 'external', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
  },
}
