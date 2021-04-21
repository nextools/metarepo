import { component, startWithType, mapDefaultProps } from 'refun'
import { ThemeContext } from '../theme-context'
import { defaultIcons } from './default-icons'
import { defaultTheme } from './default-theme'
import type { TThemeProvider } from './types'

export const ThemeProvider = component(
  startWithType<TThemeProvider>(),
  mapDefaultProps({
    theme: defaultTheme,
    icons: defaultIcons,
  })
)(({ theme, icons, children }) => (
  <ThemeContext.Provider value={{ theme, icons }}>
    {children}
  </ThemeContext.Provider>
))

ThemeProvider.displayName = 'ThemeProvider'
