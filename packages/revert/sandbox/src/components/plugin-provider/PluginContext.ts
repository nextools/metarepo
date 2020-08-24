import { createContext } from 'react'
import type { TPopoverPlugin, TProviderPlugin } from './types'

export type TPluginContext = {
  popover?: TPopoverPlugin,
  Provider?: TProviderPlugin,
}

export const PluginContext = createContext<TPluginContext>({})
