import { type ReactNode, createContext, useContext, useState } from 'react'

const context = createContext({ showScore: true, toggleScore: () => {} })

function InProgressContext({ children }: { children: ReactNode }) {
  const [showScore, setShowScore] = useState(true)
  return (
    <context.Provider value={{ showScore, toggleScore: () => setShowScore((value) => !value) }}>
      {children}
    </context.Provider>
  )
}

function useInProgressContext() {
  return useContext(context)
}

export { InProgressContext, useInProgressContext }
