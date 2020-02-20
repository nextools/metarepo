import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableSpacer } from './types'

export * from './types'

export const setupSpacerTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableSpacer, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableSpacer, ComponentMappings>(defaultTheme)

  return {
    SpacerTheme: ThemePiece,
    createThemeableSpacer: createThemeable,
  }
}
