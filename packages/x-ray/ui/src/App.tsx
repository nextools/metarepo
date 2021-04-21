import { PrimitiveRoot } from '@revert/root'
import type { FC } from 'react'
import { Main } from './components/Main'
import { RenderMetaContext } from './context/RenderMeta'
import type { TRenderMetaContext } from './context/RenderMeta'

export type TApp = TRenderMetaContext

export const App: FC<TApp> = ({ renderMeta }) => (
  <RenderMetaContext.Provider value={{ renderMeta }}>
    <PrimitiveRoot>
      {({ width, height }) => (
        <Main width={width} height={height}/>
      )}
    </PrimitiveRoot>
  </RenderMetaContext.Provider>
)
