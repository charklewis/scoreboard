import { type ActionFunctionArgs, type LoaderFunctionArgs, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Card } from '@nextui-org/react'
import { namedAction } from 'remix-utils/named-action'
import { string } from 'zod'
import { Navbar } from '~/components/navbar'

import { authenticateOtp, getUserEmail, identity, sendOtp, updateEmail } from '~/services/identity.server'
import { Account } from './account'

async function action({ request }: ActionFunctionArgs) {
  const user = await identity.isAuthenticated(request)
  if (!user || !user.stytchId) {
    //there is a mismatch in types due to return type of json in namedAction not containing { errors: { user }}
    return json({ errors: { user: 'You must be logged in to perform this action' } }) as any
  }
  return namedAction(request, {
    async sendOtp() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const methodId = await sendOtp({ stytchId: user.stytchId, email })
        if (methodId) {
          return json({ methodId, email })
        }
        return json({ errors: { email: 'An error occured while updating your email, please try again later' } })
      } catch {
        return json({ errors: { email: 'An email is required' } })
      }
    },
    async verifyOtp() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const code = string().min(6).max(6).parse(formData.get('code'))
        const methodId = string().parse(formData.get('methodId'))

        const stytchId = await authenticateOtp({ methodId, code })
        if (!stytchId) {
          return json({ errors: { code: 'Your code was not valid' } })
        }

        const success = await updateEmail({ stytchId, email })

        if (success) {
          return json({ success: true })
        }

        return json({ errors: { code: 'We are having issues verifying your information' } })
      } catch (error) {
        return json({
          errors: { code: 'An error occured while verifying your one time code, please try again later' },
        })
      }
    },
    async resendOtp() {
      try {
        const formData = await request.formData()
        const email = string().email().parse(formData.get('email'))
        const methodId = await sendOtp({ stytchId: user.stytchId, email })
        if (methodId) {
          return json({ sent: new Date() })
        }
        return json({ errors: { email: 'An error occured while resending a new code, please try again later' } })
      } catch {
        return json({ errors: { email: 'An email is required' } })
      }
    },
  })
}

async function loader({ request }: LoaderFunctionArgs) {
  const user = await identity.isAuthenticated(request)
  if (user && user.stytchId) {
    const email = await getUserEmail(user.stytchId)
    return json({ email: email || 'User' })
  } else {
    return json({ email: 'User' })
  }
}

function Settings() {
  const { email } = useLoaderData<typeof loader>() || {}
  return (
    <div>
      <Navbar user={email} />
      <main data-testid="settings-content ">
        <section className="mx-auto  max-w-screen-md p-6">
          <h1 className="my-4 text-xl font-semibold">Settings</h1>
          <Card className="p-6">
            <Account email={email} />
          </Card>
        </section>
      </main>
    </div>
  )
}

export { action, loader }
export default Settings
