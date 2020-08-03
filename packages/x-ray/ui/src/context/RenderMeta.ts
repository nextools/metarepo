import { createContext } from 'react'
import type { ReactNode } from 'react'
import type { TJsonValue } from 'typeon'

export type TRenderMetaContext = {
  renderMeta: (meta: TJsonValue) => ReactNode,
}

export const RenderMetaContext = createContext<TRenderMetaContext>({
  renderMeta: () => null,
})
