import { Root } from '@revert/root'
import type { FC } from 'react'
import { Main } from './components/Main'
import { StoreProvider } from './store'
import type { TApp } from './types'

export const App: FC<TApp> = () => (
  <StoreProvider>
    <Root>
      <Main/>
    </Root>
  </StoreProvider>
)
