import React from 'react'
import { startWithType, pureComponent, mapHandlers, mapWithPropsMemo } from 'refun'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setComponent } from '../../actions'
import { Block } from '../block'
import { TRect, TComponents } from '../../types'
import { ComponentDropdown, componentDropdownHeight } from './ComponentDropdown'

const SPACER_SIZE = 20

export type TComponentSelect = {
  components: TComponents,
} & TRect

export const ComponentSelect = pureComponent(
  startWithType<TComponentSelect>(),
  mapStoreState(({ componentKey }) => ({
    componentKey,
  }), ['componentKey']),
  mapStoreDispatch,
  mapHandlers({
    onChangeComponentName: ({ dispatch }) => (value: string | null) => dispatch(setComponent(value)),
  }),
  mapWithPropsMemo(({ components }) => ({
    options: [
      { label: 'Select a component', value: '-' },
      ...Object.keys(components).map((key) => ({ label: key, value: key })),
    ],
  }), ['components'])
)(({
  componentKey,
  width,
  height,
  top,
  left,
  options,
  onChangeComponentName,
}) => (
  <Block width={width} height={height} left={left} top={top}>
    <ComponentDropdown
      left={SPACER_SIZE}
      top={(height - componentDropdownHeight) / 2}
      width={width - SPACER_SIZE * 2}
      value={componentKey}
      options={options}
      onChange={onChangeComponentName}
    />
  </Block>
))
