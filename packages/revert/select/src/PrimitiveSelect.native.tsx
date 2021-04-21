import { Picker } from 'react-native'
import type { TextStyle } from 'react-native'
import { component, mapWithProps, startWithType } from 'refun'
import type { TSelect } from './types'

export const PrimitiveSelect = component(
  startWithType<TSelect>(),
  mapWithProps(({
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
  }) => {
    const style: TextStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    }

    return {
      style,
    }
  })
)(({
  children,
  id,
  accessibilityLabel,
  isDisabled = false,
  style,
  value,
  onChange,
}) => (
  <Picker
    testID={id}
    enabled={!isDisabled}
    style={style}
    selectedValue={value}
    onValueChange={onChange}
    accessibilityLabel={accessibilityLabel}
  >
    {children}
  </Picker>
))

PrimitiveSelect.displayName = 'PrimitiveSelect'
