import { createContext } from 'react'
import type { TPluginContext } from './types'

export const PluginContext = createContext<TPluginContext>({})

PluginContext.displayName = 'PluginContext'
