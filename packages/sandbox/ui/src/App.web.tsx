import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { Root } from './components/root'
import { ThemeProvider } from './components/theme-provider'
import { Sandbox } from './components/sandbox'
import { NotificationProvider } from './components/notification-provider'
import { AlertProvider } from './components/alert-provider'
import { PortalProvider } from './components/portal-provider'
import { setComponentsList } from './store-meta'
import { TComponents, TTheme, TThemeIcons } from './types'
import { PluginProvider, TPlugin } from './components/plugin-provider'

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  icons?: TThemeIcons,
  copyImportPackageName?: string,
  plugin?: TPlugin,
}

export const App = component(
  startWithType<TApp>(),
  onChange(({ components }) => {
    setComponentsList(components)
  }, ['components'])
)(({ theme, icons, copyImportPackageName, plugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider plugin={plugin}>
        <AlertProvider>
          <NotificationProvider>
            <PortalProvider>
              <Sandbox
                copyImportPackageName={copyImportPackageName}
              />
            </PortalProvider>
          </NotificationProvider>
        </AlertProvider>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))
