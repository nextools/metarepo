import React from 'react'
import { component, startWithType, mapState, onMount } from 'refun'
import { isUndefined } from 'tsfn'
import { ThemeContext } from '../theme-context'
import { TThemeProvider } from './types'

export const ThemeProvider = component(
  startWithType<TThemeProvider>(),
  mapState('theme', 'setTheme', ({ theme }) => theme, ['theme']),
  onMount(async ({ theme, setTheme }) => {
    if (isUndefined(theme)) {
      const { defaultTheme } = await import('./default-theme')

      setTheme(defaultTheme)
    }
  }),
  mapState('icons', 'setIcons', ({ icons }) => icons, ['icons']),
  onMount(async ({ icons, setIcons }) => {
    if (isUndefined(icons)) {
      const { defaultIcons } = await import('./default-icons')

      setIcons(defaultIcons)
    }
  })
)(({ theme, icons, children }) => {
  if (isUndefined(theme) || isUndefined(icons)) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, icons }}>
      {children}
    </ThemeContext.Provider>
  )
})
