import React from 'react'
import { startWithType, mapHandlers, pureComponent, mapState } from 'refun'
import { Switch, switchHeight } from '../switch'
import { TPosition } from '../../types'

export type TValueCheckboxProps = {
  propPath: string[],
  propValue: boolean,
  onChange: (propPath: string[], propValue: boolean) => void,
} & TPosition

export const valueCheckboxHeight = switchHeight

export const ValueCheckbox = pureComponent(
  startWithType<TValueCheckboxProps>(),
  mapState('value', 'setValue', ({ propValue }) => Boolean(propValue), ['propValue']),
  mapHandlers({
    onChange: ({ propPath, onChange, value, setValue }) => () => {
      setValue(!value)
      onChange(propPath, !value)
    },
  })
)(({ left, top, value, onChange }) => (
  <Switch
    left={left}
    top={top}
    isChecked={value}
    onToggle={onChange}
  />
))

ValueCheckbox.displayName = 'ValueCheckbox'
