import React from 'react'
import type { FC } from 'react'
import { PluginContext } from './PluginContext'
import type { TPluginContext } from './types'

export const PluginProvider: FC<TPluginContext> = ({ popoverPlugin, ComponentWrapperPlugin, children }) => (
  <PluginContext.Provider value={{ popoverPlugin, ComponentWrapperPlugin }}>
    {children}
  </PluginContext.Provider>
)
