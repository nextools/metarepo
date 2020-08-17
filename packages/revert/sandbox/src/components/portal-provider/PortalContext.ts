import { createContext } from 'react'

export type TPortalContext = {
  portalElement: HTMLDivElement | null,
}

export const PortalContext = createContext<TPortalContext>({
  portalElement: null,
})
