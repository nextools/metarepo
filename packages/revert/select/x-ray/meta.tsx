import type { TComponentConfig } from 'autoprops'
import type { TSelect } from '../src'

export const config: TComponentConfig<TSelect> = {
  props: {
    value: ['value'],
    onChange: [() => {}],
    accessibilityLabel: ['select'],
    isDisabled: [true],
    paddingTop: [10],
    paddingBottom: [10],
    paddingLeft: [10],
    paddingRight: [10],
    onBlur: [() => {}],
    onFocus: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
  },
  required: ['value', 'onChange', 'accessibilityLabel'],
  deps: {
    paddingTop: ['paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingBottom: ['paddingTop', 'paddingLeft', 'paddingRight'],
    paddingLeft: ['paddingTop', 'paddingBottom', 'paddingRight'],
    paddingRight: ['paddingTop', 'paddingBottom', 'paddingLeft'],
    onFocus: ['onBlur', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onBlur: ['onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPointerEnter: ['onFocus', 'onBlur', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPointerLeave: ['onFocus', 'onBlur', 'onPointerEnter', 'onPressIn', 'onPressOut'],
    onPressIn: ['onFocus', 'onBlur', 'onPointerEnter', 'onPointerLeave', 'onPressOut'],
    onPressOut: ['onFocus', 'onBlur', 'onPointerEnter', 'onPointerLeave', 'onPressIn'],
  },
}

export { PrimitiveSelect as Component } from '../src'
