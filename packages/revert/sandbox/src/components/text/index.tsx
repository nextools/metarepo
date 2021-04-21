import { AnimationColor } from '@revert/animation'
import { PrimitiveText as RevertPrimitiveText, CreateLayoutText, TextThemeContext } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import { component, startWithType, mapDefaultProps, mapDefaultContext } from 'refun'
import { COLOR_BLACK } from '../../colors'

export const PrimitiveText = component(
  startWithType<TPrimitiveText>(),
  mapDefaultContext(TextThemeContext),
  mapDefaultProps({
    color: COLOR_BLACK,
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 20,
  })
)((props) => (
  <AnimationColor toColor={props.color}>
    {(color) => (
      <RevertPrimitiveText {...props} color={color}/>
    )}
  </AnimationColor>
))

PrimitiveText.displayName = RevertPrimitiveText.displayName

export const Text = CreateLayoutText(PrimitiveText)
