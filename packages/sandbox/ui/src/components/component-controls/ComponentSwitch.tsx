import React from 'react'
import { startWithType, mapHandlers, pureComponent, mapState } from 'refun'
import { SYMBOL_CHECKBOX } from '../../symbols'
import { Checkmark } from '../checkmark'

export type TComponentSwitchProps = {
  isDisabled?: boolean,
  propPath: readonly string[],
  isChecked: boolean,
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const ComponentSwitch = pureComponent(
  startWithType<TComponentSwitchProps>(),
  mapState('value', 'setValue', ({ isChecked }) => isChecked, ['isChecked']),
  mapHandlers({
    onToggle: ({ setValue, onChange, propPath, isChecked }) => () => {
      setValue(!isChecked)
      onChange(
        propPath,
        isChecked ? undefined : {}
      )
    },
  })
)(({ value, isDisabled, onToggle }) => (
  <Checkmark
    isDisabled={isDisabled}
    isChecked={value}
    onToggle={onToggle}
  />
))

ComponentSwitch.displayName = 'ComponentSwitch'
ComponentSwitch.componentSymbol = SYMBOL_CHECKBOX
