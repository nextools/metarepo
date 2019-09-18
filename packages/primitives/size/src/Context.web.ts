import { createContext } from 'react'

export type TSizeContext = {
  onSizeMount: null | (() => void),
  onSizeUpdate: null | (() => void),
}

export const SizeContext = createContext<TSizeContext>({
  onSizeMount: null,
  onSizeUpdate: null,
})
