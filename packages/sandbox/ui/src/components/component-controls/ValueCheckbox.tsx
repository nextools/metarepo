import React from 'react'
import { startWithType, mapHandlers, pureComponent, mapState } from 'refun'
import { Switch } from '../switch'
import { SYMBOL_SWITCH } from '../../symbols'

export type TValueCheckboxProps = {
  propPath: readonly string[],
  checkedPropValue: any,
  propValue: any,
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const ValueCheckbox = pureComponent(
  startWithType<TValueCheckboxProps>(),
  mapState('isChecked', 'setIsChecked', ({ propValue }) => propValue !== false && propValue !== undefined, ['propValue']),
  mapHandlers({
    onChange: ({ propPath, checkedPropValue, onChange, isChecked, setIsChecked }) => () => {
      setIsChecked(!isChecked)
      onChange(propPath, isChecked ? undefined : checkedPropValue)
    },
  })
)(({ isChecked, onChange }) => (
  <Switch
    isChecked={isChecked}
    onToggle={onChange}
  />
))

ValueCheckbox.displayName = 'ValueCheckbox'
ValueCheckbox.componentSymbol = SYMBOL_SWITCH
