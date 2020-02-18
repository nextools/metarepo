import { createContext } from 'react'
import { TPlugin } from './types'

export type TPluginContext = {
  plugin?: TPlugin,
}

export const PluginContext = createContext<TPluginContext>({})
