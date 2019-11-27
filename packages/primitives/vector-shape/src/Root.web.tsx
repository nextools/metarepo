import React, { FC } from 'react'
import { Block } from '@primitives/block'
import { Surface, Shape } from '@primitives/svg'
import { colorToString } from 'colorido'
import { TVectorShape } from './types'

export const VectorShape: FC<TVectorShape> = ({ color = [0, 0, 0, 1], height, id, path, width }) => (
  <Block shouldIgnorePointerEvents>
    <Surface id={id} height={height} width={width}>
      <Shape
        d={path}
        fill={colorToString(color)}
      />
    </Surface>
  </Block>
)

VectorShape.displayName = 'VectorShape'
