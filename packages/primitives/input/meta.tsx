import { TComponentConfig } from 'autoprops'
import { component, startWithType, mapState, mapHandlers } from 'refun'
import { Input, TInput } from './src'

export const Component = component(
  startWithType<TInput>(),
  mapState('value', 'setValue', ({ value }) => value, ['value']),
  mapHandlers({
    onChange: ({ onChange, setValue }) => (value: string) => {
      setValue(value)
      onChange(value)
    },
  })
)(Input)

Component.displayName = 'Input'

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

export { default as packageJson } from './package.json'
