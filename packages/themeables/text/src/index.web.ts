import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableText } from './types'

export * from './types'

export const setupTextTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableText, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableText, ComponentMappings>(defaultTheme)

  return {
    TextTheme: ThemePiece,
    createThemeableText: createThemeable,
  }
}
