import React from 'react'
import { component, startWithType, mapDefaultProps } from 'refun'
import { ThemeContext } from '../theme-context'
import { defaultTheme } from './default-theme'
import { TThemeProvider } from './types'
import { defaultIcons } from './default-icons'

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
