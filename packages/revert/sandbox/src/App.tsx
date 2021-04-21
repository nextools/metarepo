import { LayoutPortalProvider } from '@revert/layout'
import { Root } from '@revert/root'
import { component, startWithType, onChange } from 'refun'
import { AlertProvider } from './components/alert-provider'
import { ImportPackageNameProvider } from './components/import-package-name-provider'
import { NotificationProvider } from './components/notification-provider'
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
)(({ theme, icons, getImportPackageName, popoverPlugin, componentPlugin }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider popoverPlugin={popoverPlugin} componentPlugin={componentPlugin}>
        <ImportPackageNameProvider getImportPackageName={getImportPackageName}>
          <LayoutPortalProvider>
            <AlertProvider>
              <NotificationProvider>
                <Sandbox/>
              </NotificationProvider>
            </AlertProvider>
          </LayoutPortalProvider>
        </ImportPackageNameProvider>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))

App.displayName = 'App'
