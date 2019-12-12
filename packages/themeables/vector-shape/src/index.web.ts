import { setupTheme, TThemeables } from '@themeables/core'
import { TThemeableVectorShape } from './types'

export * from './types'

export const setupVectorShapeTheme = <ComponentMappings>(defaultTheme: TThemeables<TThemeableVectorShape, ComponentMappings>) => {
  const { ThemePiece, createThemeable } = setupTheme<TThemeableVectorShape, ComponentMappings>(defaultTheme)

  return {
    VectorShapeTheme: ThemePiece,
    createThemeableVectorShape: createThemeable,
  }
}
