import { TComponentConfig } from 'autoprops'
import { TInput } from './src/types'

export const config: TComponentConfig<TInput> = {
  props: {
    isDisabled: [true],
    color: ['#ff0000'],
    fontSize: [24],
    fontFamily: ['serif'],
    fontWeight: [700],
    lineHeight: [24],
    letterSpacing: [5],
    paddingLeft: [10],
    paddingTop: [10],
    paddingRight: [10],
    paddingBottom: [10],
    value: ['value'],
    onChange: [() => {}],
  },
  required: ['value', 'onChange'],
  mutin: [
    ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'],
  ],
}

export { Input as Component } from './src'
