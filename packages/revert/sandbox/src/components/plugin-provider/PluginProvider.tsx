import type { FC } from 'react'
import { PluginContext } from './PluginContext'
import type { TComponentPlugin, TPopoverPlugin } from './types'

export type TPluginProvider = {
  popoverPlugin?: TPopoverPlugin,
  componentPlugin?: TComponentPlugin,
}

export const PluginProvider: FC<TPluginProvider> = ({ popoverPlugin, componentPlugin = {}, children }) => (
  <PluginContext.Provider
    value={{
      popoverPlugin,
      ComponentWrapper: componentPlugin.ComponentWrapper,
      shouldMeasureComponent: componentPlugin.shouldMeasureComponent,
    }}
  >
    {children}
  </PluginContext.Provider>
)
