import { createContext } from 'react'

export type TLayoutPortalContext = {
  portalElement: Element | null,
}

export const LayoutPortalContext = createContext<TLayoutPortalContext>({
  portalElement: null,
})

LayoutPortalContext.displayName = 'LayoutPortalContext'
