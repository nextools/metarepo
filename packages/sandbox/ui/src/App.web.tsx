import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { StoreProvider } from './store'
import { Sandbox } from './components/sandbox'
import { ThemeContext } from './components/themes'
import { TComponents, TThemes } from './types'

export type TApp = {
  components: TComponents,
  theme: TThemes,
}

export const App: FC<TApp> = ({ components, theme }) => (
  <Root>
    {({ width, height }) => (
      <StoreProvider>
        <ThemeContext.Provider value={{ theme }}>
          <Sandbox
            components={components}
            width={width}
            height={height}
            top={0}
            left={0}
          />
        </ThemeContext.Provider>
      </StoreProvider>
    )}
  </Root>
)
