import type { TBackground } from '@revert/background'
import { Background } from '@revert/background'
import type { TBorder } from '@revert/border'
import { Border } from '@revert/border'
import type { TPrimitiveText } from '@revert/text'
import { PrimitiveText, Text } from '@revert/text'
import { createContext } from 'react'
import type { FC } from 'react'

export type TMarkdownPrimitivesContext = {
  PrimitiveText: FC<TPrimitiveText>,
  LayoutText: FC<TPrimitiveText>,
  LayoutBackground: FC<TBackground>,
  LayoutBorder: FC<TBorder>,
}

export const MarkdownPrimitivesContext = createContext<TMarkdownPrimitivesContext>({
  PrimitiveText,
  LayoutBackground: Background,
  LayoutBorder: Border,
  LayoutText: Text,
})
