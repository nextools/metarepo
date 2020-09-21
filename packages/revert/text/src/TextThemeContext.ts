import { createContext } from 'react'
import type { TTextStyle } from './types'

export const TextThemeContext = createContext<TTextStyle>({})
