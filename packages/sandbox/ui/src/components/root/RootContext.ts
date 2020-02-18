import { createContext } from 'react'

export type TRootContext = {
  _rootWidth: number,
  _rootHeight: number,
}

export const RootContext = createContext<TRootContext>({
  _rootWidth: 0,
  _rootHeight: 0,
})
