import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableBackground } from './types'

export * from './types'

export const setupBackgroundTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableBackground, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground, ComponentMappings>(defaultTheme)

  return {
    BackgroundTheme: ThemePiece,
    createThemeableBackground: createThemeable,
  }
}
