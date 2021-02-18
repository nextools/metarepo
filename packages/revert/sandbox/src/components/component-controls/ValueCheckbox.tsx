import { startWithType, mapHandlers, pureComponent, mapState, mapDebouncedHandlerTimeout } from 'refun'
import { SYMBOL_SWITCH } from '../../symbols'
import { Switch } from '../switch'

export type TValueCheckboxProps = {
  propPath: readonly string[],
  checkedPropValue: any,
  propValue: any,
  onChange: (propPath: readonly string[], propValue: any) => void,
}

const isDefined = (val: any): boolean => val !== false && val !== undefined

export const ValueCheckbox = pureComponent(
  startWithType<TValueCheckboxProps>(),
  mapState('isChecked', 'setIsChecked', ({ propValue }) => isDefined(propValue), ['propValue']),
  mapHandlers({
    onOptimisticWait: ({ propValue, isChecked, setIsChecked }) => () => {
      const validState = isDefined(propValue)

      if (validState !== isChecked) {
        setIsChecked(validState)
      }
    },
  }),
  mapDebouncedHandlerTimeout('onOptimisticWait', 500),
  mapHandlers({
    onChange: ({ propPath, checkedPropValue, onChange, isChecked, setIsChecked, onOptimisticWait }) => () => {
      setIsChecked(!isChecked)
      onOptimisticWait()
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
