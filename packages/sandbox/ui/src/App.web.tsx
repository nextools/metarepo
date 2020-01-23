import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { Sandbox } from './components/sandbox'
import { ThemeContext } from './components/themes'
import { TApp } from './types'

export const App: FC<TApp> = ({ components, theme, copyImportPackageName }) => (
  <Root>
    {({ width, height }) => (
      <ThemeContext.Provider value={{ theme }}>
        <Sandbox
          components={components}
          copyImportPackageName={copyImportPackageName}
          width={width}
          height={height}
          top={0}
          left={0}
        />
      </ThemeContext.Provider>
    )}
  </Root>
)
