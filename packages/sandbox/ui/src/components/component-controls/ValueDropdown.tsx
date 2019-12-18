import React from 'react'
import { startWithType, mapHandlers, mapWithProps, pureComponent, mapState, mapWithPropsMemo } from 'refun'
import { Dropdown } from '../dropdown'
import { SYMBOL_DROPDOWN } from '../../symbols'
import { printValue } from './print-value'

export type TValueDropdownProps = {
  propPath: readonly string[],
  propValue: any,
  propPossibleValues: readonly any[],
  isPropRequired: boolean,
  onChange: (propPath: readonly string[], selectedValue: any) => void,
}

export const ValueDropdown = pureComponent(
  startWithType<TValueDropdownProps>(),
  mapWithPropsMemo(({ propPossibleValues, isPropRequired }) => ({
    options: propPossibleValues.reduce((result, value, i) => {
      if (i === 0 && !isPropRequired) {
        result.push({ label: printValue(undefined), value: '-' })
      }

      result.push({ label: printValue(value), value: String(i) })

      return result
    }, []),
  }), ['propPossibleValues', 'isPropRequired']),
  mapWithProps(({ propPossibleValues, propValue }) => {
    const valueIndex = propPossibleValues.indexOf(propValue)

    return {
      value: valueIndex >= 0 ? String(valueIndex) : '-',
    }
  }),
  mapState('value', 'setValue', ({ value }) => value, ['value']),
  mapHandlers({
    onChange: ({ propPath, propPossibleValues, setValue, onChange }) => (value: string) => {
      setValue(value)

      if (value === '-') {
        onChange(propPath, undefined)
      } else {
        onChange(propPath, propPossibleValues[Number(value)])
      }
    },
  })
)(({ value, options, onChange }) => (
  <Dropdown
    options={options}
    value={value}
    onChange={onChange}
  />
))

ValueDropdown.displayName = 'ValueDropdown'
ValueDropdown.componentSymbol = SYMBOL_DROPDOWN
