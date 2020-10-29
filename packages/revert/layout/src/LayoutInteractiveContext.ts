import { createContext } from 'react'

export type TLayoutInteractiveContext = {
  _isHovered: boolean,
  _isPressed: boolean,
}

export const LayoutInteractiveContext = createContext<TLayoutInteractiveContext>({
  _isHovered: false,
  _isPressed: false,
})

LayoutInteractiveContext.displayName = 'LayoutInteractiveContext'
