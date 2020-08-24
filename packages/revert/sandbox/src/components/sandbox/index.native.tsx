import React from 'react'
import { component, startWithType } from 'refun'
import { DemoArea } from '../demo-area'
import { RootThemeProvider } from '../theme-context'

export const Sandbox = component(
  startWithType<{}>()
)(() => (
  <RootThemeProvider>
    <DemoArea/>
  </RootThemeProvider>
))

Sandbox.displayName = 'Sandbox'
