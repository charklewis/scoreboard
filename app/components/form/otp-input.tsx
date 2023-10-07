import classNames from 'classnames'
import { useState } from 'react'
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
        renderInput={(props, index) => (
          <input
            {...props}
            className={classNames(
              'block w-1/6 rounded-md border-0 py-4 pl-4',
              'text-4xl text-neutral-900 shadow-sm placeholder:text-neutral-400 sm:leading-6',
              'ring-1 ring-inset focus:ring-2 focus:ring-inset',
              'read-only:bg-neutral-50 read-only:text-neutral-500 read-only:focus:ring-1 read-only:focus:ring-neutral-200',
              error
                ? 'ring-red-400 placeholder:text-red-300 focus:ring-red-500'
                : 'ring-neutral-300 placeholder:text-neutral-400 focus:ring-green-600'
            )}
            data-testid={`input-${name}-${index}`}
          />
        )}
      />
      <input type="hidden" name={name} value={code} data-testid={`input-hidden-${name}`} />
    </div>
  )
}

export { OtpInput }
