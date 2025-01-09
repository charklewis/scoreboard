import { type ComponentProps } from 'react'
import { Label } from '~/components/ui//label'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { color } from '~/database/static'

const colors = Object.entries(color).map(([name, value]) => ({ name: name, ...value }))

function ColorPicker({
  defaultValue,
  setValue,
  ...props
}: ComponentProps<typeof Input> & { setValue: (value: string) => void }) {
  return (
    <div>
      <Input {...props} defaultValue={defaultValue} hidden type="hidden" id="color" required />
      <Label>Color</Label>
      <RadioGroup
        name="color-picker"
        defaultValue={defaultValue as string}
        className="mt-2"
        onChange={(event) => setValue((event.target as HTMLInputElement).value)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {colors.map((color) => (
            <RadioGroupItem
              key={color.name}
              value={color.name}
              data-testid={`input-${color.name}`}
              className={`${color.bgColor} ${color.selectedColor}`}
            />
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export { ColorPicker }
