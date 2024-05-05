import { type FetcherWithComponents, Form as RemixForm, useNavigation } from '@remix-run/react'
import { type ReactNode, createContext, useContext } from 'react'

const Context = createContext<{
  isLoading: boolean
  errors?: Record<string, string>
  defaultValues?: any
  action?: string
}>({ isLoading: false })

type Props = {
  fetcher?: FetcherWithComponents<any>
  id: string
  action?: string
  method?: 'post' | 'get'
  errors?: Record<string, string>
  defaultValues?: any
  className?: string
  children: ReactNode
}

function Form({ method = 'post', ...props }: Props) {
  const navigation = useNavigation()
  const { action, className, id, errors, fetcher, defaultValues, children } = props

  const isLoading = navigation.state !== 'idle'

  if (fetcher) {
    return (
      <fetcher.Form id={id} className={className} method={method} action={action} data-testid={`form-${id}`}>
        <Context.Provider value={{ action, isLoading, errors: isLoading ? {} : errors, defaultValues }}>
          {children}
        </Context.Provider>
      </fetcher.Form>
    )
  }

  return (
    <RemixForm id={id} className={className} method={method} action={action} data-testid={`form-${id}`}>
      <Context.Provider value={{ action, isLoading, errors: isLoading ? {} : errors, defaultValues }}>
        {children}
      </Context.Provider>
    </RemixForm>
  )
}

function useForm() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Form components cannot be rendered outside the Form component')
  }
  return { ...context }
}

export { Form, useForm }
