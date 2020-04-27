import React from 'react'
import { component, startWithType, mapDefaultProps } from 'refun'
import { colorToString, TColor } from 'colorido'
import { Surface, Shape } from '@primitives/svg'
import { COLOR_BLACK } from '../config'
import { AnimationColor } from './AnimationColor'

export type TIcon = {
  d: string,
  color?: TColor,
}

export const Icon = component(
  startWithType<TIcon>(),
  mapDefaultProps({
    color: COLOR_BLACK,
  })
)(({ d, color }) => (
  <Surface height={20} width={20}>
    <AnimationColor values={color} time={200}>
      {(color) => (
        <Shape
          d={d}
          fill={colorToString(color)}
        />
      )}
    </AnimationColor>
  </Surface>
))

Icon.displayName = 'Icon'
