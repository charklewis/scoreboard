import { config as defaultConfig } from '@epic-web/config/prettier'

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = { ...defaultConfig, printWidth: 120, useTabs: false }

export default config
