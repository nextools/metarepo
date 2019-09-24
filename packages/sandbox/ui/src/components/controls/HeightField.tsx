import React from 'react'
import { mapState, mapHandlers, pureComponent, startWithType } from 'refun'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setHeight } from '../../actions'
import { TPosition } from '../../types'
import { Field } from '../field'

export type THeightField = TPosition

export const heightFieldWidth = 60
export const heightFieldHeight = 30

export const HeightField = pureComponent(
  startWithType<THeightField>(),
  mapStoreState(({ height }) => ({ canvasHeight: height }), ['height']),
  mapStoreDispatch,
  mapHandlers({
    dispatchValue: ({ dispatch }) => (value: number) => dispatch(setHeight(value)),
  }),
  mapState('value', 'setValue', ({ canvasHeight }) => String(canvasHeight), ['canvasHeight']),
  mapHandlers({
    submitValue: ({ value, dispatchValue }) => () => dispatchValue(Number(value)),
  })
)(({ top, left, value, setValue, submitValue }) => (
  <Field
    left={left}
    top={top}
    width={heightFieldWidth}
    height={heightFieldHeight}
    value={value}
    onChange={setValue}
    onSubmit={submitValue}
  />
))

HeightField.displayName = 'HeightField'
