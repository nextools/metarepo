import React, { FC } from 'react'
import { Block } from '@primitives/block'
import { colorToString } from 'colorido'
import { TThemeableBackground } from '@themeables/background'

export type TBackground = TThemeableBackground

export const Background: FC<TBackground> = ({ topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius, color }) => (
  <Block
    shouldIgnorePointerEvents
    isFloating
    top={0}
    right={0}
    bottom={0}
    left={0}
    style={{
      borderTopLeftRadius: topLeftRadius,
      borderTopRightRadius: topRightRadius,
      borderBottomLeftRadius: bottomLeftRadius,
      borderBottomRightRadius: bottomRightRadius,
      backgroundColor: colorToString(color),
    }}
  />
)

Background.displayName = 'Background'
