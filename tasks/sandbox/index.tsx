/* eslint-disable import/no-extraneous-dependencies */
import { App as SandboxApp } from '@revert/sandbox'
import { components } from './components'

export const App = () => (
  <SandboxApp components={components}/>
)
