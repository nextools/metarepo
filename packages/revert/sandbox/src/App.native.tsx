import { Root } from '@revert/root'
import { component, startWithType, onChange } from 'refun'
import { PluginProvider } from './components/plugin-provider'
import { Sandbox } from './components/sandbox'
import { ThemeProvider } from './components/theme-provider'
import { setComponentsList } from './store-meta'
import type { TApp } from './types'
import './store'
import './store-sync'

export const App = component(
  startWithType<TApp>(),
  onChange(({ components }) => {
    setComponentsList(components)
  }, ['components'])
)(({ theme, icons, popoverPlugin, componentPlugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider popoverPlugin={popoverPlugin} componentPlugin={componentPlugin}>
        <Sandbox/>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))

App.displayName = 'App'
