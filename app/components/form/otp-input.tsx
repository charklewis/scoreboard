import { useState } from 'react'
import { Input, type InputProps } from '@nextui-org/react'
import OTPInput from 'react-otp-input'

import { useInputGroup } from '.'

function OtpInput() {
  const { name, error } = useInputGroup()
  const [code, setCode] = useState('')

  const handlePaste: React.ClipboardEventHandler = (event) => {
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
        renderSeparator={<span className="text-xl text-neutral-400">-</span>}
        renderInput={(props, index) => {
          const id = `input-${name}-${index}`
          return (
            <Input
              {...(props as InputProps)}
              isInvalid={Boolean(error)}
              id={id}
              name={id}
              data-testid={id}
              variant="bordered"
              size="lg"
              pattern="[0-9]*"
            />
          )
        }}
      />
      <input type="hidden" name={name} value={code} data-testid={`input-hidden-${name}`} />
    </div>
  )
}

export { OtpInput }
