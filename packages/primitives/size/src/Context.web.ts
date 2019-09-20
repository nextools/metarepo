import { createContext } from 'react'

export type TSizeContext = {
  onSizeMount?: (id: number) => void,
  onSizeUpdate?: (id: number) => void,
}

export const SizeContext = createContext<TSizeContext>({})
