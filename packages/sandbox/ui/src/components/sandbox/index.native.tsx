import React from 'react'
import { component, startWithType } from 'refun'
import { DemoArea } from '../demo-area'
import { RootThemeProvider } from '../theme-context'

export type TSandbox = {
  copyImportPackageName?: string,
}

export const Sandbox = component(
  startWithType<TSandbox>()
)(() => (
  <RootThemeProvider>
    <DemoArea/>
  </RootThemeProvider>
))

Sandbox.displayName = 'Sandbox'
