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
    'react/jsx-no-leaked-render': [WARN, { validStrategies: ['ternary'] }],
    'jsx-a11y/anchor-has-content': [WARN, { ignoreComponents: ['Link'] }],
  },
}
