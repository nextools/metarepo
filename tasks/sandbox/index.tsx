import React from 'react'
import { App as SandboxApp } from '@sandbox/ui'
import { components } from './components'
import { theme } from './theme'

export const App = () => (
  <SandboxApp
    components={components}
    theme={theme}
  />
)
