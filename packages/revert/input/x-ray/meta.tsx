import type { TComponentConfig } from 'autoprops'
import type { TPrimitiveInput } from '../src'

export const config: TComponentConfig<TPrimitiveInput> = {
  props: {
    top: [10],
    left: [10],
    width: [100],
    height: [50],
    accessibilityLabel: ['input'],
    value: ['value'],
    isDisabled: [true],
    color: [0x000000ff],
    fontFamily: ['Arial'],
    fontSize: [16],
    fontWeight: [400],
    letterSpacing: [1],
    lineHeight: [20],
    paddingTop: [4],
    paddingBottom: [4],
    paddingLeft: [4],
    paddingRight: [4],
    onChange: [() => {}],
    onBlur: [() => {}],
    onFocus: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
    onSubmit: [() => {}],
  },
  required: ['value', 'onChange', 'accessibilityLabel'],
  deps: {
    paddingTop: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingBottom: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingLeft: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingRight: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    width: ['height', 'left', 'top'],
    height: ['width', 'left', 'top'],
    top: ['left', 'width', 'height'],
    left: ['top', 'width', 'height'],
    fontFamily: ['fontSize', 'fontWeight', 'letterSpacing', 'lineHeight'],
    fontSize: ['fontFamily', 'fontWeight', 'letterSpacing', 'lineHeight'],
    fontWeight: ['fontSize', 'fontFamily', 'letterSpacing', 'lineHeight'],
    letterSpacing: ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'],
    lineHeight: ['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing'],
    onBlur: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onFocus: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPointerEnter: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPointerLeave: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPressIn: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
    onPressOut: ['onBlur', 'onFocus', 'onPointerEnter', 'onPointerLeave', 'onPressIn', 'onPressOut'],
  },
}

export { PrimitiveInput as Component } from '../src'