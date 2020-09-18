import type { FC } from 'react'
import { component, mapDefaultContext, startWithType } from 'refun'
import { TextThemeContext } from './TextThemeContext'
import type { TPrimitiveText } from './types'

export const CreateThemeableText = (PrimitiveText: FC<TPrimitiveText>) => {
  const ThemeableText = component(
    startWithType<TPrimitiveText>(),
    mapDefaultContext(TextThemeContext)
  )(PrimitiveText)

  ThemeableText.displayName = PrimitiveText.displayName

  return ThemeableText
}
