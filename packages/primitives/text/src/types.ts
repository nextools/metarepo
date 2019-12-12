import { ReactNode } from 'react'
import { TThemeableText } from '@themeables/text'

export type TText = {
  id?: string,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
  children: ReactNode,
} & TThemeableText
