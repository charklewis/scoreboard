import Hashids from 'hashids'
import { environment } from './environment.server'

const hashids = new Hashids(environment.ID_HASH_SALT, 12)

function encode(id: number) {
  return hashids.encode(id)
}

function decode(id: string) {
  return hashids.decode(id)[0] as number
}

export { encode, decode }
