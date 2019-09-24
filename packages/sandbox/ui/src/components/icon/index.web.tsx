import React from 'react'
import { component, startWithType } from 'refun'
import { colorToString, TColor } from 'colorido'
import { Surface, Shape } from '@primitives/svg'
import { Block } from '@primitives/block'
import { AnimationColor } from '../animation-color'

export type TIcon = {
  d: string,
  color: TColor,
}

export const Icon = component(
  startWithType<TIcon>()
)(({ d, color }) => (
  <Block shouldIgnorePointerEvents>
    <Surface height={20} width={20}>
      <AnimationColor values={color}>
        {(color) => (
          <Shape
            d={d}
            fill={colorToString(color)}
          />
        )}
      </AnimationColor>
    </Surface>
  </Block>
))

Icon.displayName = 'Icon'
