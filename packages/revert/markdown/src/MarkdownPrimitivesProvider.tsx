import type { TPrimitiveBackground } from '@revert/background'
import { CreateLayoutBackground, PrimitiveBackground } from '@revert/background'
import type { TPrimitiveBorder } from '@revert/border'
import { CreateLayoutBorder, PrimitiveBorder } from '@revert/border'
import type { TPrimitiveText } from '@revert/text'
import { CreateLayoutText, PrimitiveText } from '@revert/text'
import type { FC } from 'react'
import { mapDefaultProps, mapWithPropsMemo, pureComponent, startWithType } from 'refun'
import { MarkdownPrimitivesContext } from './MarkdownPrimitivesContext'

export type TMarkdownPrimitivesProvider = {
  PrimitiveText?: FC<TPrimitiveText>,
  PrimitiveBackground?: FC<TPrimitiveBackground>,
  PrimitiveBorder?: FC<TPrimitiveBorder>,
}

export const MarkdownPrimitivesProvider = pureComponent(
  startWithType<TMarkdownPrimitivesProvider>(),
  mapDefaultProps({
    PrimitiveText,
    PrimitiveBackground,
    PrimitiveBorder,
  }),
  mapWithPropsMemo(({ PrimitiveBackground, PrimitiveBorder, PrimitiveText }) => ({
    LayoutBackground: CreateLayoutBackground(PrimitiveBackground),
    LayoutBorder: CreateLayoutBorder(PrimitiveBorder),
    LayoutText: CreateLayoutText(PrimitiveText),
  }), ['PrimitiveBackground', 'PrimitiveBorder', 'PrimitiveText'])
)(({
  PrimitiveText,
  LayoutBackground,
  LayoutBorder,
  LayoutText,
  children,
}) => (
  <MarkdownPrimitivesContext.Provider
    value={{
      PrimitiveText,
      LayoutBackground,
      LayoutBorder,
      LayoutText,
    }}
  >
    {children}
  </MarkdownPrimitivesContext.Provider>
))

MarkdownPrimitivesProvider.displayName = 'MarkdownPrimitivesProvider'
