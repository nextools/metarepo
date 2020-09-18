import type { TBackground, TPrimitiveBackground } from '@revert/background'
import { CreateLayoutBackground, Background, PrimitiveBackground } from '@revert/background'
import type { TBorder, TPrimitiveBorder } from '@revert/border'
import { CreateLayoutBorder, Border, PrimitiveBorder } from '@revert/border'
import type { TPrimitiveText } from '@revert/text'
import { CreateLayoutText, PrimitiveText, Text } from '@revert/text'
import React, { createContext } from 'react'
import type { FC } from 'react'
import { mapDefaultProps, pureComponent, startWithType } from 'refun'

export type TMarkdownPrimitivesContext = {
  PrimitiveText: FC<TPrimitiveText>,
  LayoutText: FC<TPrimitiveText>,
  Background: FC<TBackground>,
  Border: FC<TBorder>,
}

export const MarkdownPrimitivesContext = createContext<TMarkdownPrimitivesContext>({
  PrimitiveText,
  Background,
  Border,
  LayoutText: Text,
})

export type TCreateMarkdownComponent = {
  PrimitiveText?: FC<TPrimitiveText>,
  PrimitiveBackground?: FC<TPrimitiveBackground>,
  PrimitiveBorder?: FC<TPrimitiveBorder>,
}

export const MarkdownPrimitivesProvider = pureComponent(
  startWithType<TCreateMarkdownComponent>(),
  mapDefaultProps({
    PrimitiveText,
    PrimitiveBackground,
    PrimitiveBorder,
  })
)(({
  PrimitiveBackground,
  PrimitiveBorder,
  PrimitiveText,
  children,
}) => (
  <MarkdownPrimitivesContext.Provider
    value={{
      PrimitiveText,
      Background: CreateLayoutBackground(PrimitiveBackground),
      Border: CreateLayoutBorder(PrimitiveBorder),
      LayoutText: CreateLayoutText(PrimitiveText),
    }}
  >
    {children}
  </MarkdownPrimitivesContext.Provider>
))

MarkdownPrimitivesProvider.displayName = 'MarkdownPrimitivesProvider'
