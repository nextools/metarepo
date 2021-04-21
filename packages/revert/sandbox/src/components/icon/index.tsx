import { AnimationColor, AnimationValue } from '@revert/animation'
import { PrimitiveBlock } from '@revert/block'
import { colorToString } from '@revert/color'
import { Surface, Shape } from '@revert/svg'
import { TextThemeContext } from '@revert/text'
import { PrimitiveTransform } from '@revert/transform'
import { component, startWithType, mapContext, mapDefaultProps } from 'refun'
import { SYMBOL_ICON } from '../../symbols'
import { orientationMap } from './orientation-map'
import type { TIconOrientation } from './types'

export type { TIconOrientation } from './types'

export type TIcon = {
  d: string,
  size?: number,
  orientation?: TIconOrientation,
}

export const Icon = component(
  startWithType<TIcon>(),
  mapContext(TextThemeContext),
  mapDefaultProps({
    size: 20,
    orientation: 'up',
    color: 0xff,
  })
)(({ d, color, size, orientation }) => (
  <PrimitiveBlock width={size} height={size} shouldIgnorePointerEvents shouldFlow>
    <AnimationValue toValue={orientationMap[orientation]}>
      {(rotate) => (
        <PrimitiveTransform rotate={rotate}>
          <Surface height={size} width={size}>
            <AnimationColor toColor={color}>
              {(color) => (
                <Shape d={d} fill={colorToString(color)}/>
              )}
            </AnimationColor>
          </Surface>
        </PrimitiveTransform>
      )}
    </AnimationValue>
  </PrimitiveBlock>
))

Icon.displayName = 'Icon'
Icon.componentSymbol = SYMBOL_ICON
