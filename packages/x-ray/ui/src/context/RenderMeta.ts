import { createContext, ReactNode } from 'react'
import { TJsonValue } from 'typeon'

export type TRenderMetaContext = {
  renderMeta: (meta: TJsonValue) => ReactNode,
}

export const RenderMetaContext = createContext<TRenderMetaContext>({
  renderMeta: () => null,
})
