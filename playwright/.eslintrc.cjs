/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['plugin:playwright/recommended', 'prettier'],
  rules: {
    'playwright/expect-expect': ['off'],
  },
}
