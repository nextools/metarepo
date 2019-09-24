import { createContext } from 'react'
import { TThemes } from '../../types'

export type TThemeContext = {
  theme: TThemes,
}

export const ThemeContext = createContext<TThemeContext>({} as TThemeContext)
