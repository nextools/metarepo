import { Text } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TLink } from '../src'

const TextConfig: TComponentConfig<TPrimitiveText> = {
  props: {
    color: [0xeeeeeeff],
    fontSize: [16],
    isUnderline: [true],
    children: ['link text'],
  },
  required: ['children', 'color', 'fontSize', 'isUnderline'],
}

export const config: TComponentConfig<TLink, 'text'> = {
  props: {
    href: ['http://localhost'],
    target: ['about:blank'],
    tabIndex: [0],
    isDisabled: [true],
    onPress: [() => {}],
    onBlur: [() => {}],
    onFocus: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
  },
  children: {
    text: {
      Component: Text,
      config: TextConfig,
    },
  },
  required: ['text'],
  deps: {
    onFocus: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onBlur: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPress: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPressIn: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPressOut: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPointerEnter: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
    onPointerLeave: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPress', 'onPressIn', 'onPressOut'],
  },
}

export { PrimitiveLink as Component } from '../src'
