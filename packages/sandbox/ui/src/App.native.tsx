import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { setComponentsList } from './store-meta'
import { TComponents, TTheme } from './types'
import { TPlugin } from './components/plugin-provider'

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export const App = component(
  startWithType<TApp>(),
  onChange(({ components }) => {
    setComponentsList(components)
  }, ['components'])
)(({ theme, copyImportPackageName }) => (
  <Root>
    <ThemeProvider theme={theme}>
      <Sandbox
        copyImportPackageName={copyImportPackageName}
      />
    </ThemeProvider>
  </Root>
))
