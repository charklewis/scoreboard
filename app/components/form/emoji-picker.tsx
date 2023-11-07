import { faker } from '@faker-js/faker'
import { RadioGroup } from '@headlessui/react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { emoji } from '~/database/static'
import { useForm, useInputGroup } from '.'

const emojies = Object.entries(emoji).map(([name, value]) => ({ name, value }))

function EmojiPicker({ onChange }: { onChange?: (value: string) => void }) {
  const { isLoading } = useForm()
  const { name } = useInputGroup()
  const [selectedEmoji, setSelectedEmoji] = useState(() => faker.helpers.arrayElement(emojies).name)

  useEffect(() => {
    if (!onChange) return
    onChange(selectedEmoji)
  }, [onChange, selectedEmoji])

  return (
    <>
      <input type="hidden" value={selectedEmoji} id={name} name={name} data-testid={`input-hidden-${name}`} />
      <RadioGroup value={selectedEmoji} onChange={setSelectedEmoji} disabled={isLoading}>
        <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">Emoji</RadioGroup.Label>
        <div className="mt-4 flex flex-wrap items-center">
          {emojies.map((emoji) => (
            <RadioGroup.Option
              key={emoji.name}
              value={emoji.name}
              data-testid={`input-${name}-${emoji.name}`}
              className={({ active, checked }) =>
                clsx(
                  active || checked ? 'border-neutral-900' : 'border-white',
                  'relative m-1 flex cursor-pointer items-center justify-center rounded-full border-2 p-0.5 focus:outline-none'
                )
              }
            >
              <RadioGroup.Label as="span" className="sr-only">
                {emoji.name}
              </RadioGroup.Label>
              <span aria-hidden="true" className="flex content-center justify-center rounded-full text-3xl">
                {emoji.value}
              </span>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  )
}

export { EmojiPicker }
