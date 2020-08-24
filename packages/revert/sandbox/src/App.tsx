import { Root } from '@revert/root'
import React from 'react'
import { component, startWithType, onChange } from 'refun'
import { AlertProvider } from './components/alert-provider'
import { ImportPackageNameProvider } from './components/import-package-name-provider'
import { NotificationProvider } from './components/notification-provider'
import { PluginProvider } from './components/plugin-provider'
import { PortalProvider } from './components/portal-provider'
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
)(({ theme, icons, getImportPackageName, popoverPlugin, Provider }) => (
  <Root>
    <ThemeProvider theme={theme} icons={icons}>
      <PluginProvider popover={popoverPlugin} Provider={Provider}>
        <ImportPackageNameProvider getImportPackageName={getImportPackageName}>
          <AlertProvider>
            <NotificationProvider>
              <PortalProvider>
                <Sandbox/>
              </PortalProvider>
            </NotificationProvider>
          </AlertProvider>
        </ImportPackageNameProvider>
      </PluginProvider>
    </ThemeProvider>
  </Root>
))
