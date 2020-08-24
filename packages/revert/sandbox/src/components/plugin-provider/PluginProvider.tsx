import React from 'react'
import type { FC } from 'react'
import { PluginContext } from './PluginContext'
import type { TPopoverPlugin, TProviderPlugin } from './types'

export type TPluginProvider = {
  popover?: TPopoverPlugin,
  Provider?: TProviderPlugin,
}

export const PluginProvider: FC<TPluginProvider> = ({ popover, Provider, children }) => (
  <PluginContext.Provider value={{ popover, Provider }}>
    {children}
  </PluginContext.Provider>
)
