import { ReactNode } from 'react'
import { TThemeableText } from '@themeables/text'

export type THeading = {
  id?: string,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
  level?: number,
  children: ReactNode,
} & TThemeableText
