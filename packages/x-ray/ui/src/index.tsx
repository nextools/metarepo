import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { StoreProvider } from './store'
import { Main } from './components/Main'

export const App: FC<{}> = () => (
  <StoreProvider>
    <Root>
      {({ width, height }) => (
        <Main width={width} height={height}/>
      )}
    </Root>
  </StoreProvider>
)
