/* eslint-disable import/no-extraneous-dependencies */
import { App as SandboxApp } from '@revert/sandbox'
import React from 'react'
import { components } from './components'

export const App = () => (
  <SandboxApp components={components}/>
)
