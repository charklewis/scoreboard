declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      COOKIE_SECRET: string
      STYTCH_PROJECT_ID: string
      STYTCH_SECRET: string
      ID_HASH_SALT: string
    }
  }
}

const getVariable = (name: keyof NodeJS.ProcessEnv) => {
  const variable = process.env[name] || ''
  if (!variable && process.env['NODE_ENV'] !== 'test') {
    throw new Error(`${name} environment variable is required.`)
  }
  return variable
}

const environment = {
  NODE_ENV: getVariable('NODE_ENV'),
  DATABASE_URL: getVariable('DATABASE_URL'),
  COOKIE_SECRET: getVariable('COOKIE_SECRET'),
  STYTCH_PROJECT_ID: getVariable('STYTCH_PROJECT_ID'),
  STYTCH_SECRET: getVariable('STYTCH_SECRET'),
  ID_HASH_SALT: getVariable('ID_HASH_SALT'),
}

export { environment }
