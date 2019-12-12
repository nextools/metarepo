import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableImage } from './types'

export * from './types'

export const setupImageTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableImage, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableImage, ComponentMappings>(defaultTheme)

  return {
    ImageTheme: ThemePiece,
    createThemeableImage: createThemeable,
  }
}
