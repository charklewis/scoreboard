import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
const TOKEN_PATH = path.join(process.cwd(), 'token.json')
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json')

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH)
    const credentials = JSON.parse(content as unknown as string)
    return google.auth.fromJSON(credentials)
  } catch (err) {
    return null
  }
}

async function saveCredentials(client: any) {
  const content = await fs.readFile(CREDENTIALS_PATH)
  const keys = JSON.parse(content as unknown as string)
  const key = keys.installed || keys.web
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
    expires_in: 31556952, //1 year
  })
  await fs.writeFile(TOKEN_PATH, payload)
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist()
  if (client) return client
  client = (await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })) as any
  if (client?.credentials) {
    await saveCredentials(client)
  }
  return client
}

async function getMessages(auth: any, email: string) {
  const gmail = google.gmail({ version: 'v1', auth })
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: `to:${email}`,
  })

  if (!response.data.messages) {
    return []
  }

  const promises = []

  for (const message of response.data.messages) {
    const id = message.id
    if (!id) continue
    const promise = new Promise((resolve, reject) => {
      gmail.users.messages.get({ userId: 'me', id, format: 'full' }, (err, res) => {
        if (err) reject(err)
        else resolve(res)
      })
    })
    promises.push(promise)
  }

  const messages = await Promise.all(promises)
  return messages.filter((message: any) => message.data).map((message: any) => message.data)
}

function getMessageContent(payload: any) {
  const content = { html: '', text: '' }
  if (payload.body.size) {
    switch (payload.mimeType) {
      case 'text/html':
        content.html = Buffer.from(payload.body.data, 'base64').toString('utf8')
        break
      case 'text/plain':
      default:
        content.text = Buffer.from(payload.body.data, 'base64').toString('utf8')
        break
    }
  } else {
    let parts = [...payload.parts]
    while (parts.length) {
      const part = parts.shift()
      if (part.parts) {
        parts = parts.concat(part.parts)
      }
      if (part.mimeType === 'text/plain') {
        content.text = Buffer.from(part.body.data, 'base64').toString('utf8')
      } else if (part.mimeType === 'text/html') {
        content.html = Buffer.from(part.body.data, 'base64').toString('utf8')
      }
    }
  }
  return content
}

async function getOneTimeCodeFromGmail(email: string) {
  const messages = await authorize().then((auth) => getMessages(auth, email))
  const codes = messages.map((message) => {
    const { text } = getMessageContent(message.payload)
    return text.match(/\b\d{6}\b/)?.[0]
  })
  return codes.filter((code) => code)[0]
}

export { getOneTimeCodeFromGmail }
