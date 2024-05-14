import { useFetcher } from '@remix-run/react'

import { Code, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import { Button } from '~/components/button'
import { ErrorMessage, Form, InputGroup, OtpInput, Button as SubmitButton } from '~/components/form'

function UpdateEmail({
  email,
  methodId,
  isOpen,
  onOpenChange,
}: {
  email?: string
  methodId?: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const verifyOtp = useFetcher<{ success?: boolean; errors?: { code: string } }>()
  const resendOtp = useFetcher<{ sent?: number }>()

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton={true}
      backdrop="blur"
      data-testid="modal-check-word"
      isDismissable={Boolean(verifyOtp.state === 'idle' && resendOtp.state === 'idle')}
    >
      <ModalContent>
        <ModalBody>
          {verifyOtp.data?.success ? (
            <div className="py-4 text-center">
              <p className=" text-xl font-semibold">Success</p>
              <p className="mb-3 mt-2">Your email verification is complete, your account has been updated.</p>
              <Code className="mx-auto mb-6 block max-w-fit whitespace-normal break-words">{email}</Code>
              <Button
                id="close-update-email"
                color="primary"
                onPress={() => onOpenChange(true)}
                text="Close"
                className="w-full text-white"
              />
            </div>
          ) : (
            <>
              <Form
                id="otp"
                action="?/verifyOtp"
                fetcher={verifyOtp}
                className="space-y-6"
                errors={verifyOtp?.data?.errors || {}}
              >
                <input type="hidden" name="methodId" value={methodId} />
                <input type="hidden" name="email" value={email} />
                <p className="text-center font-semibold">Enter your OTP code</p>
                <InputGroup name="code">
                  <OtpInput />
                  <ErrorMessage />
                </InputGroup>
                <SubmitButton
                  id="submit-otp"
                  type="submit"
                  text="Verify"
                  loadingText="Verifying..."
                  color="primary"
                  className="w-full"
                />
              </Form>

              <Form id="otp-resend" action="?/resendOtp" fetcher={resendOtp} className="mb-2">
                <div>
                  <input type="hidden" name="email" value={email} />
                  <SubmitButton
                    id="resend-otp"
                    type="submit"
                    variant="light"
                    text="Resend new code"
                    loadingText="Sending..."
                    className="w-full"
                  />
                  {resendOtp.state === 'idle' && resendOtp.data?.sent ? (
                    <p className="mt-2 text-center text-xs text-neutral-600" data-testid="resend-code-timestamp">
                      Sent: {new Date(resendOtp.data.sent).toLocaleString()}
                    </p>
                  ) : null}
                </div>
              </Form>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export { UpdateEmail }
