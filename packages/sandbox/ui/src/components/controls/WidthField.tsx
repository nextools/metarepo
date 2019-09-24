import React from 'react'
import { mapState, mapHandlers, pureComponent, startWithType } from 'refun'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setWidth } from '../../actions'
import { TPosition } from '../../types'
import { Field } from '../field'

export type TWidthField = TPosition

export const widthFieldWidth = 60
export const widthFieldHeight = 30

export const WidthField = pureComponent(
  startWithType<TWidthField>(),
  mapStoreState(({ width }) => ({ canvasWidth: width }), ['width']),
  mapStoreDispatch,
  mapHandlers({
    dispatchValue: ({ dispatch }) => (value: number) => dispatch(setWidth(value)),
  }),
  mapState('value', 'setValue', ({ canvasWidth }) => String(canvasWidth), ['canvasWidth']),
  mapHandlers({
    submitValue: ({ value, dispatchValue }) => () => dispatchValue(Number(value)),
  })
)(({ top, left, value, setValue, submitValue }) => (
  <Field
    left={left}
    top={top}
    width={widthFieldWidth}
    height={widthFieldHeight}
    value={value}
    onChange={setValue}
    onSubmit={submitValue}
  />
))

WidthField.displayName = 'WidthField'
