import React from 'react'
import { App as SandboxApp } from '@sandbox/ui'
import { components } from './components'

export const App = () => (
  <SandboxApp
    components={components}
    copyImportPackageName={'primitives'}
  />
)
