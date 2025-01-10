import { redirect } from 'react-router'

async function loader() {
  throw redirect('scrabble')
}

export { loader }
