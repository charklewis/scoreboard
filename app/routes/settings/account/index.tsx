import { useFetcher } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Divider, useDisclosure } from '@nextui-org/react'
import { Button } from '~/components/button'
import { Form, Input, InputGroup, Button as SubmitButton } from '~/components/form'
import { UpdateEmail } from './update-email'

function Account({ email }: { email: string }) {
  const sendOtp = useFetcher<{ methodId: string; email: string; errors: Record<string, string> }>()
  const [updatingEmail, setUpdatingEmail] = useState(false)
  const {
    isOpen: updateEmailIsOpen,
    onOpen: updateEmailOnOpen,
    onOpenChange: updateEmailOnOpenChange,
  } = useDisclosure()

  useEffect(() => {
    if (sendOtp.state === 'loading' && !updatingEmail) {
      setUpdatingEmail(true)
    }
  }, [sendOtp.state, updatingEmail])

  useEffect(() => {
    if (!updatingEmail) return
    if (sendOtp.state === 'idle' && sendOtp.data?.methodId) {
      updateEmailOnOpen()
      setUpdatingEmail(false)
    }
  }, [sendOtp.data?.methodId, sendOtp.state, updateEmailOnOpen, updatingEmail])

  return (
    <div>
      <div>
        <p className="font-medium">Information</p>
        <p className="my-2 text-sm text-default-400">Updating your email will require you to verify this change.</p>
        <Form
          id="account-email"
          fetcher={sendOtp}
          action="?/sendOtp"
          method="post"
          className="mt-4"
          defaultValues={{ email }}
          errors={sendOtp.data?.errors || {}}
        >
          <div className="flex items-end gap-2">
            <InputGroup name="email">
              <Input type="email" label="Email" placeholder="Enter email" />
            </InputGroup>
            <SubmitButton
              id="save-email"
              type="submit"
              text="Save"
              loadingText=""
              color="primary"
              onPress={() => setUpdatingEmail(true)}
            />
          </div>
        </Form>
        <UpdateEmail
          email={sendOtp.data?.email}
          methodId={sendOtp.data?.methodId}
          isOpen={updateEmailIsOpen}
          onOpenChange={updateEmailOnOpenChange}
        />
      </div>
      <Divider className="mb-6 mt-8" />
      <div>
        <p className="font-medium text-danger">Delete Account</p>
        <p className="mb-4 mt-2 text-sm text-default-400">
          You can delete your account, including all games, players and other associated data. This is action is
          permanent and can not be undone.
        </p>
        <Button id="delete-account" text="Delete account" variant="faded" color="danger" isDisabled={true} />
      </div>
    </div>
  )
}

export { Account }
