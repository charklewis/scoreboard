import { type ClipboardEventHandler, useState } from 'react'
import { Input, type InputProps } from '@nextui-org/react'
import OTPInput from 'react-otp-input'

import { useInputGroup } from '.'

function OtpInput() {
  const { name } = useInputGroup()
  const [code, setCode] = useState('')

  const handlePaste: ClipboardEventHandler = (event) => {
    const data = event.clipboardData.getData('text')
    setCode(data)
  }

  return (
    <div>
      <OTPInput
        value={code}
        onChange={setCode}
        onPaste={handlePaste}
        numInputs={6}
        skipDefaultStyles
        shouldAutoFocus
        containerStyle="gap-1"
        renderSeparator={<span className="text-xl text-neutral-300 dark:text-neutral-700">-</span>}
        renderInput={(props, index) => {
          const id = `input-${name}-${index}`
          return (
            <Input
              {...(props as InputProps)}
              id={id}
              name={id}
              data-testid={id}
              variant="bordered"
              size="lg"
              pattern="[0-9]*"
              classNames={{ input: 'text-center text-2xl' }}
            />
          )
        }}
      />
      <input type="hidden" name={name} value={code} data-testid={`input-hidden-${name}`} />
    </div>
  )
}

export { OtpInput }
