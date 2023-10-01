/* eslint-env es6 */
const OFF = 0
const WARN = 1
// const ERROR = 2;

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['./.eslintrc.cjs', '@remix-run/eslint-config/internal'],
  settings: { 'import/internal-regex': '^~/' },
  rules: {
    'prefer-let/prefer-let': OFF,
    'prefer-const': WARN,
    'import/order': [
      WARN,
      {
        alphabetize: { caseInsensitive: true, order: 'asc' },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
      },
    ],

    'react/jsx-no-leaked-render': [WARN, { validStrategies: ['ternary'] }],
  },
}
