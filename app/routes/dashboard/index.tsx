import { redirect } from 'react-router'

async function loader() {
  throw redirect('games')
}

export { loader }
