import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { Main } from './components/Main'
import { RenderMetaContext, TRenderMetaContext } from './context/RenderMeta'

export type TApp = TRenderMetaContext

export const App: FC<TApp> = ({ renderMeta }) => (
  <RenderMetaContext.Provider value={{ renderMeta }}>
    <Root>
      {({ width, height }) => (
        <Main width={width} height={height}/>
      )}
    </Root>
  </RenderMetaContext.Provider>
)
