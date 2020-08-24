import type { TComponentConfig } from 'autoprops'
import type { TLink } from '../src'

export const config: TComponentConfig<TLink> = {
  props: {
    href: ['http://localhost'],
    target: ['about:blank'],
    tabIndex: [0],
    isDisabled: [true],
    children: ['link text'],
    onPress: [() => {}],
    onBlur: [() => {}],
    onFocus: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
  },
  required: ['children'],
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
