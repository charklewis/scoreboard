import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { clsx } from 'clsx'
import { useForm, useInputGroup } from '.'

const colors = [
  { name: 'slate', bgColor: 'bg-slate-500', selectedColor: 'ring-slate-500' },
  { name: 'zinc', bgColor: 'bg-zinc-500', selectedColor: 'ring-zinc-500' },
  { name: 'neutral', bgColor: 'bg-neutral-500', selectedColor: 'ring-neutral-500' },
  { name: 'red', bgColor: 'bg-red-500', selectedColor: 'ring-red-500' },
  { name: 'orange', bgColor: 'bg-orange-500', selectedColor: 'ring-orange-500' },
  { name: 'amber', bgColor: 'bg-amber-500', selectedColor: 'ring-amber-500' },
  { name: 'yellow', bgColor: 'bg-yellow-500', selectedColor: 'ring-yellow-500' },
  { name: 'lime', bgColor: 'bg-lime-500', selectedColor: 'ring-lime-500' },
  { name: 'green', bgColor: 'bg-green-500', selectedColor: 'ring-green-500' },
  { name: 'emerald', bgColor: 'bg-emerald-500', selectedColor: 'ring-emerald-500' },
  { name: 'teal', bgColor: 'bg-teal-500', selectedColor: 'ring-teal-500' },
  { name: 'cyan', bgColor: 'bg-cyan-500', selectedColor: 'ring-cyan-500' },
  { name: 'sky', bgColor: 'bg-sky-500', selectedColor: 'ring-sky-500' },
  { name: 'blue', bgColor: 'bg-blue-500', selectedColor: 'ring-blue-500' },
  { name: 'indigo', bgColor: 'bg-indigo-500', selectedColor: 'ring-indigo-500' },
  { name: 'violet', bgColor: 'bg-violet-500', selectedColor: 'ring-violet-500' },
  { name: 'purple', bgColor: 'bg-purple-500', selectedColor: 'ring-purple-500' },
  { name: 'fuchsia', bgColor: 'bg-fuchsia-500', selectedColor: 'ring-fuchsia-500' },
  { name: 'pink', bgColor: 'bg-pink-500', selectedColor: 'ring-pink-500' },
  { name: 'rose', bgColor: 'bg-rose-500', selectedColor: 'ring-rose-500' },
]

function ColorPicker() {
  const { isLoading } = useForm()
  const { name } = useInputGroup()
  const [selectedColor, setSelectedColor] = useState(colors[1])

  return (
    <>
      <input type="hidden" value={selectedColor.name} id={name} name={name} data-testid={`input-${name}`} />
      <RadioGroup value={selectedColor} onChange={setSelectedColor} disabled={isLoading}>
        <RadioGroup.Label className="block text-sm font-medium leading-6 text-gray-900">
          Choose a label color
        </RadioGroup.Label>
        <div className="mt-4 flex flex-wrap items-center">
          {colors.map((color) => (
            <RadioGroup.Option
              key={color.name}
              value={color.name}
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
