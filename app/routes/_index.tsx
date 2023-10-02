import { redirect } from '@remix-run/node'

async function loader() {
  return redirect('/dashboard')
}

export { loader }
