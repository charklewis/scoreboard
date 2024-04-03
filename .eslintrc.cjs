/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'prettier',
  ],
  ignorePatterns: ['playwright/**'],
  // we're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but it means we have to explicitly
  // set the jest version.
  settings: {
    jest: {
      version: 28,
    },
  },
  rules: {
    'jsx-a11y/anchor-has-content': [
      1,
      {
        ignoreComponents: ['Link'],
      },
    ],
    'import/order': [
      1,
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
