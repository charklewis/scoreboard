import { faker } from '@faker-js/faker'
import { RadioGroup } from '@headlessui/react'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { color } from '~/database/static'
import { useForm, useInputGroup } from '.'

type Color = keyof typeof color

const colors = Object.entries(color).map(([name, value]) => ({ name: name as Color, ...value }))

function ColorPicker({ onChange }: { onChange?: (value: Color) => void }) {
  const { isLoading } = useForm()
  const { name } = useInputGroup()
  const [selectedColor, setSelectedColor] = useState(() => faker.helpers.arrayElement(colors).name)

  useEffect(() => {
    if (!onChange) return
    onChange(selectedColor)
  }, [onChange, selectedColor])

  return (
    <>
      <input type="hidden" value={selectedColor} id={name} name={name} data-testid={`input-hidden-${name}`} />
      <RadioGroup value={selectedColor} onChange={setSelectedColor} disabled={isLoading}>
        <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">
          Background Colour
        </RadioGroup.Label>
        <div className="mt-4 flex flex-wrap items-center">
          {colors.map((color) => (
            <RadioGroup.Option
              key={color.name}
              value={color.name}
              data-testid={`input-${name}-${color.name}`}
              className={({ active, checked }) =>
                clsx(
                  color.selectedColor,
                  active && checked ? 'ring ring-offset-1' : '',
                  !active && checked ? 'ring-2' : '',
                  'relative m-1 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                )
              }
            >
              <RadioGroup.Label as="span" className="sr-only">
                {color.name}
              </RadioGroup.Label>
              <span
                aria-hidden="true"
                className={clsx(color.bgColor, 'h-8 w-8 rounded-full border border-black border-opacity-10')}
              />
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  )
}

export { ColorPicker }
