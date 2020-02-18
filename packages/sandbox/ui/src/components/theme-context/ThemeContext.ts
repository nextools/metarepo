import { createContext } from 'react'
import { TTheme, TThemeIcons } from '../../types'

export type TThemeContext = {
  theme: TTheme,
  icons: TThemeIcons,
}

export const ThemeContext = createContext<TThemeContext>({} as TThemeContext)
