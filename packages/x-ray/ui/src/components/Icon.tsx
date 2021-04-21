import { AnimationColor } from '@revert/animation'
import type { TColor } from '@revert/color'
import { colorToString } from '@revert/color'
import { Surface, Shape } from '@revert/svg'
import { component, startWithType, mapDefaultProps } from 'refun'
import { COLOR_BLACK } from '../config'

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
    <AnimationColor toColor={color} time={200}>
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
