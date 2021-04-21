import { PrimitiveBlock } from '@revert/block'
import { Switch } from 'react-native'
import type { ViewStyle } from 'react-native'
import { component, startWithType, mapDefaultProps } from 'refun'
import type { TPrimitiveCheckbox } from './types'

const style: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  opacity: 0,
}

export const PrimitiveCheckbox = component(
  startWithType<TPrimitiveCheckbox>(),
  mapDefaultProps({
    left: 0,
    top: 0,
  })
)(({
  left,
  top,
  width,
  height,
  id,
  accessibilityLabel,
  isDisabled,
  isChecked,
  onToggle,
  onPressIn,
  onPressOut,
  children,
}) => (
  <PrimitiveBlock left={left} top={top} width={width} height={height}>
    {children}
    <Switch
      value={isChecked}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      onTouchStart={onPressIn}
      onTouchEnd={onPressOut}
      testID={id}
      style={style}
      onValueChange={onToggle}
    />
  </PrimitiveBlock>
))

PrimitiveCheckbox.displayName = 'Checkbox'
