import React from 'react'
import { component, startWithType, mapState, onUpdateAsync } from 'refun'
import { isUndefined } from 'tsfn'
import { ThemeContext } from '../theme-context'
import type { TThemeProvider } from './types'

export const ThemeProvider = component(
  startWithType<TThemeProvider>(),
  mapState('theme', 'setTheme', ({ theme }) => theme, ['theme']),
  onUpdateAsync((props) => function *() {
    if (isUndefined(props.current.theme)) {
      const { defaultTheme } = yield import('./default-theme' /* webpackChunkName: "defaultTheme" */)

      props.current.setTheme(defaultTheme)
    }
  }, []),
  mapState('icons', 'setIcons', ({ icons }) => icons, ['icons']),
  onUpdateAsync((props) => function *() {
    if (isUndefined(props.current.icons)) {
      const { defaultIcons } = yield import('./default-icons' /* webpackChunkName: "defaultIcons" */)

      props.current.setIcons(defaultIcons)
    }
  }, [])
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
