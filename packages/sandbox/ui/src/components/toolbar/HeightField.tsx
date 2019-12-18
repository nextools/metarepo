import React from 'react'
import { mapState, mapHandlers, pureComponent, startWithType } from 'refun'
import { mapStoreState, setHeight } from '../../store'
import { SYMBOL_FIELD } from '../../symbols'
import { FieldLight } from '../field-light'

export type THeightField = {}

export const HeightField = pureComponent(
  startWithType<THeightField>(),
  mapStoreState(({ height }) => ({ canvasHeight: height }), ['height']),
  mapState('value', 'setValue', ({ canvasHeight }) => String(canvasHeight), ['canvasHeight']),
  mapHandlers({
    submitValue: ({ value }) => () => setHeight(Number(value)),
  })
)(({ value, setValue, submitValue }) => (
  <FieldLight
    suffix="px"
    value={value}
    onChange={setValue}
    onSubmit={submitValue}
  />
))

HeightField.displayName = 'HeightField'
HeightField.componentSymbol = SYMBOL_FIELD
