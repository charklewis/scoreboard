import { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import { RadioGroup } from '@headlessui/react'
import { cn } from '@nextui-org/react'

import { emoji } from '~/database/static'

import { useForm, useInputGroup } from '.'

type Emoji = keyof typeof emoji

const emojies = Object.entries(emoji).map(([name, value]) => ({ name: name as Emoji, value }))

function EmojiPicker({ onChange }: { onChange?: (value: Emoji) => void }) {
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
        <RadioGroup.Label className="block text-sm font-medium leading-6">Emoji</RadioGroup.Label>
        <div className="mt-4 flex flex-wrap items-center justify-between">
          {emojies.map((emoji) => (
            <RadioGroup.Option
              key={emoji.name}
              value={emoji.name}
              data-testid={`input-${name}-${emoji.name}`}
              className={({ active, checked }) =>
                cn(
                  active || checked ? 'rounded-md bg-blue-700 bg-opacity-25' : '',
                  'relative m-1 flex cursor-pointer items-center justify-center rounded-full border-white p-0.5 focus:outline-none'
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
