import { type ReactNode, createContext, useContext } from 'react'

import { useForm } from './form'

const Context = createContext<{
  name: string
  error?: string
}>({ name: '' })

interface Props {
  name: string
  children: ReactNode
}

const InputGroup = ({ name, children }: Props) => {
  return <Context.Provider value={{ name }}>{children}</Context.Provider>
}

const useInputGroup = () => {
  const input = useContext(Context)
  const { errors, defaultValues } = useForm()

  return {
    ...input,
    defaultValue: defaultValues?.[input.name],
    error: errors?.[input.name],
  }
}

export { InputGroup, useInputGroup }
