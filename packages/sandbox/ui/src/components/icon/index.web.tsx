import React from 'react'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { Surface, Shape } from '@primitives/svg'
import { Transform } from '@primitives/transform'
import { colorToString } from '../../colors'
import { AnimationColor, AnimationValue } from '../animation'
import { SYMBOL_ICON } from '../../symbols'
import { TextThemeContext } from '../theme-context'
import { PrimitiveBlock } from '../primitive-block'
import { orientationMap } from './orientation-map'
import { TIconOrientation } from './types'

export * from './types'

export type TIcon = {
  d: string,
  size?: number,
  orientation?: TIconOrientation,
}

export const Icon = component(
  startWithType<TIcon>(),
  mapDefaultProps({
    size: 20,
    orientation: 'up',
  }),
  mapContext(TextThemeContext)
)(({ d, color, size, orientation }) => (
  <PrimitiveBlock width={size} height={size} shouldIgnorePointerEvents shouldFlow>
    <AnimationValue toValue={orientationMap[orientation]}>
      {(rotate) => (
        <Transform rotate={rotate}>
          <Surface height={size} width={size}>
            <AnimationColor toColor={color}>
              {(color) => (
                <Shape d={d} fill={colorToString(color)}/>
              )}
            </AnimationColor>
          </Surface>
        </Transform>
      )}
    </AnimationValue>
  </PrimitiveBlock>
))

Icon.displayName = 'Icon'
Icon.componentSymbol = SYMBOL_ICON
