import { TComponentConfig } from 'autoprops'
import { TCheckboxProps } from './src/types'

export const config: TComponentConfig<TCheckboxProps> = {
  props: {
    isChecked: [false, true],
    accessibilityLabel: ['checkbox'],
    isDisabled: [true],
    onToggle: [() => {}],
    onFocus: [() => {}],
    onBlur: [() => {}],
    onPointerEnter: [() => {}],
    onPointerLeave: [() => {}],
    onPressIn: [() => {}],
    onPressOut: [() => {}],
  },
  required: ['isChecked', 'onToggle'],
}

export { Checkbox as Component } from './src'

export { default as packageJson } from './package.json'
