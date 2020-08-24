import type { TComponentConfig } from 'autoprops'
import type { TCheckbox } from '../src'

export const config: TComponentConfig<TCheckbox> = {
  props: {
    accessibilityLabel: ['checkbox'],
    isDisabled: [true],
    isChecked: [true],
    onToggle: [() => {}],
    onFocus: [() => {}],
    onBlur: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
  },
  required: ['accessibilityLabel'],
  deps: {
    onToggle: ['onFocus', 'onBlur', 'onPressIn', 'onPressOut', 'onPointerEnter', 'onPointerLeave'],
    onFocus: ['onToggle', 'onBlur', 'onPressIn', 'onPressOut', 'onPointerEnter', 'onPointerLeave'],
    onBlur: ['onToggle', 'onFocus', 'onPressIn', 'onPressOut', 'onPointerEnter', 'onPointerLeave'],
    onPressIn: ['onToggle', 'onFocus', 'onBlur', 'onPressOut', 'onPointerEnter', 'onPointerLeave'],
    onPressOut: ['onToggle', 'onFocus', 'onBlur', 'onPressIn', 'onPointerEnter', 'onPointerLeave'],
    onPointerEnter: ['onToggle', 'onFocus', 'onBlur', 'onPressIn', 'onPressOut', 'onPointerLeave'],
    onPointerLeave: ['onToggle', 'onFocus', 'onBlur', 'onPressIn', 'onPressOut', 'onPointerEnter'],
  },
}

export { Checkbox as Component } from '../src'
