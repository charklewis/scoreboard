declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      COOKIE_SECRET: string
      STYTCH_PROJECT_ID: string
      STYTCH_SECRET: string
      VERCEL_ANALYTICS_ID: string
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
  VERCEL_ANALYTICS_ID: getVariable('VERCEL_ANALYTICS_ID'),
}

export { environment }
