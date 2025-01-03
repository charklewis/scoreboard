import Hashids from 'hashids'

import { environment } from './environment'

const hashids = new Hashids(environment.ID_HASH_SALT, 12)

function encode(id: number) {
  return hashids.encode(id)
}

function decode(id: string) {
  return hashids.decode(id)[0] as number
}

function encodeBase64(id: string) {
  return Buffer.from(id).toString('base64')
}

function decodeBase64(id: string) {
  return Buffer.from(id, 'base64').toString('utf-8')
}

export { encode, decode, encodeBase64, decodeBase64 }
