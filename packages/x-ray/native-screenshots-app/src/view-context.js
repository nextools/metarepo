import { createContext } from 'react'

export const ViewContext = createContext({
  onRender() {},
  onLayout() {},
  onMount() {},
})
