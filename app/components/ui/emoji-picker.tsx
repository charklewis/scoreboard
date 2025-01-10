import { type ComponentProps } from 'react'
import { Label } from '~/components/ui//label'
import { Input } from '~/components/ui/input'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { emoji } from '~/database/static'

const emojis = Object.entries(emoji).map(([name, value]) => ({ name: name, value }))

function EmojiPicker({
  defaultValue,
  setValue,
  ...props
}: ComponentProps<typeof Input> & { setValue: (value: string) => void }) {
  return (
    <div>
      <Input {...props} defaultValue={defaultValue} hidden type="hidden" id="emoji" required />
      <Label>Emoji</Label>
      <RadioGroup
        name="emoji-picker"
        defaultValue={defaultValue as string}
        className="mt-2"
        onChange={(event) => setValue((event.target as HTMLInputElement).value)}
      >
        <div className="flex flex-wrap items-center gap-2">
          {emojis.map((emoji) => (
            <RadioGroupItem
              key={emoji.name}
              value={emoji.name}
              data-testid={`input-${emoji.name}`}
              className="bg-neutral-100 dark:bg-neutral-800"
            >
              {emoji.value}
            </RadioGroupItem>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export { EmojiPicker }
