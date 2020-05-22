import { createContext } from 'react'

export type TThemeContext = {
  darkMode: boolean,
  onToggleTheme: () => void,
}

export const ThemeContext = createContext<TThemeContext>({
  darkMode: false,
  onToggleTheme: () => null,
})
