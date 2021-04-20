import type { TOption } from '@revert/select'
import { startWithType, mapHandlers, mapWithProps, pureComponent, mapState, mapWithPropsMemo, mapDebouncedHandlerTimeout, mapDefaultProps } from 'refun'
import { SYMBOL_DROPDOWN } from '../../symbols'
import { Dropdown } from '../dropdown'
import { defaultPrintValue } from './print-value'

export type TValueDropdownProps = {
  propPath: readonly string[],
  propValue: any,
  propPossibleValues: readonly any[],
  isPropRequired: boolean,
  printValue?: (value: any) => string,
  onChange: (propPath: readonly string[], selectedValue: any) => void,
}

export const ValueDropdown = pureComponent(
  startWithType<TValueDropdownProps>(),
  mapDefaultProps({
    printValue: defaultPrintValue,
  }),
  mapWithPropsMemo(({ propPossibleValues, isPropRequired, printValue }) => ({
    options: propPossibleValues.reduce((result: TOption[], value, i) => {
      if (i === 0 && isPropRequired === false) {
        result.push({ label: printValue(undefined), value: '-' })
      }

      result.push({ label: printValue(value), value: String(i) })

      return result
    }, [] as TOption[]),
  }), ['propPossibleValues', 'isPropRequired']),
  mapWithProps(({ propPossibleValues, propValue }) => {
    const valueIndex = propPossibleValues.indexOf(propValue)

    return {
      stateValue: valueIndex >= 0 ? String(valueIndex) : '-',
    }
  }),
  mapState('value', 'setValue', ({ stateValue }) => stateValue, ['stateValue']),
  mapHandlers({
    onOptimisticWait: ({ stateValue, value, setValue }) => () => {
      if (stateValue !== value) {
        setValue(stateValue)
      }
    },
  }),
  mapDebouncedHandlerTimeout('onOptimisticWait', 500),
  mapHandlers({
    onChange: ({ propPath, propPossibleValues, setValue, onChange, onOptimisticWait }) => (value: string) => {
      setValue(value)
      onOptimisticWait()

      onChange(
        propPath,
        value === '-' ? undefined : propPossibleValues[Number(value)]
      )
    },
  })
)(({ options, value, onChange }) => (
  <Dropdown
    options={options}
    value={value}
    onChange={onChange}
  />
))

ValueDropdown.displayName = 'ValueDropdown'
ValueDropdown.componentSymbol = SYMBOL_DROPDOWN
