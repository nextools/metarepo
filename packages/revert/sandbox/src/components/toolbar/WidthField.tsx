import { mapState, mapHandlers, pureComponent, startWithType } from 'refun'
import { mapStoreState, setWidth } from '../../store'
import { SYMBOL_FIELD } from '../../symbols'
import { FieldLight } from '../field-light'

export const WidthField = pureComponent(
  startWithType<{}>(),
  mapStoreState(({ width }) => ({ canvasWidth: width }), ['width']),
  mapState('value', 'setValue', ({ canvasWidth }) => String(canvasWidth), ['canvasWidth']),
  mapHandlers({
    submitValue: ({ value }) => () => setWidth(Number(value)),
  })
)(({
  value,
  setValue,
  submitValue,
}) => (
  <FieldLight
    type="number"
    suffix="px"
    value={value}
    onChange={setValue}
    onSubmit={submitValue}
  />
))

WidthField.displayName = 'WidthField'
WidthField.componentSymbol = SYMBOL_FIELD
