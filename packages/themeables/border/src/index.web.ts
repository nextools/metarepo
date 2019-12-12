import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableBorder } from './types'

export * from './types'

export const setupBorderTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableBorder, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableBorder, ComponentMappings>(defaultTheme)

  return {
    BorderTheme: ThemePiece,
    createThemeableBorder: createThemeable,
  }
}
