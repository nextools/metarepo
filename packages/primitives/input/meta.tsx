import { TComponentConfig } from 'autoprops'
import { TInput } from './src/types'

export const config: TComponentConfig<TInput> = {
  props: {
    isDisabled: [true],
    color: [[0xff, 0x00, 0x00, 1]],
    fontSize: [24],
    fontFamily: ['Arial'],
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
