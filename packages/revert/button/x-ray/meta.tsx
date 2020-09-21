import { Text } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TButton } from '../src'

export const TextConfig: TComponentConfig<TPrimitiveText> = {
  props: {
    children: ['text'],
  },
  required: ['children'],
}

export const config: TComponentConfig<TButton, 'text'> = {
  props: {
    accessibilityLabel: ['Button'],
    isDisabled: [true],
    onBlur: [() => {}],
    onFocus: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPress: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
  },
  children: {
    text: {
      Component: Text,
      config: TextConfig,
    },
  },
  required: ['accessibilityLabel', 'text'],
  deps: {
    onBlur: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onFocus: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPointerEnter: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPointerLeave: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPress: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPressIn: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPressOut: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
  },
}

export { Button as Component } from '../src'
