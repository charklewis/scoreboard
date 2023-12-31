import { clsx } from 'clsx'
import { useForm, useInputGroup } from '.'

type Props = Partial<Pick<HTMLInputElement, 'placeholder' | 'type'>>

function Input(props: Props) {
  const { isLoading } = useForm()
  const { name, defaultValue, error } = useInputGroup()

  return (
    <input
      className={clsx(
        'block w-full rounded-md border-0 px-1.5 py-1.5',
        'text-neutral-900 shadow-sm placeholder:text-neutral-400 sm:text-sm sm:leading-6',
        'ring-1 ring-inset focus:ring-2 focus:ring-inset',
        'read-only:bg-neutral-50 read-only:text-neutral-500 read-only:focus:ring-1 read-only:focus:ring-neutral-200',
        error
          ? 'ring-red-400 placeholder:text-red-300 focus:ring-red-500'
          : 'ring-neutral-300 placeholder:text-neutral-400 focus:ring-green-600'
      )}
      defaultValue={defaultValue}
      id={name}
      name={name}
      data-testid={`input-${name}`}
      readOnly={isLoading}
      {...props}
    />
  )
}

export { Input }
