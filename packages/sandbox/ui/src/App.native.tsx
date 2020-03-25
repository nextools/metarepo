import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { setComponentsList } from './store-meta'
import { TComponents, TTheme, TThemeIcons } from './types'
import { TPlugin, PluginProvider } from './components/plugin-provider'

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  icons?: TThemeIcons,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export const App = component(
  startWithType<TApp>(),
  onChange(async ({ components }) => {
    await setComponentsList(components)
  }, ['components'])
)(({ theme, icons, copyImportPackageName, plugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider plugin={plugin}>
        <Sandbox
          copyImportPackageName={copyImportPackageName}
        />
      </PluginProvider>
    </ThemeProvider>
  </Root>
))
