import { ReactNode } from 'react'
import { TThemeableText } from '@themeables/text'

type TSupportedRoles = 'paragraph' | 'important' | 'emphasis' | 'none'

export type TText = {
  id?: string,
  role?: TSupportedRoles,
  isItalic?: boolean,
  shouldPreserveWhitespace?: boolean,
  shouldPreventWrap?: boolean,
  shouldPreventSelection?: boolean,
  shouldHideOverflow?: boolean,
  children: ReactNode,
} & TThemeableText
