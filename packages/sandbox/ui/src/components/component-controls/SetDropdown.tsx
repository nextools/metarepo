import React from 'react'
import { startWithType, mapHandlers, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../../types'
import { Dropdown } from '../dropdown'

export type TSetDropdownProps = {
  value: number,
  onChange: (value: number) => void,
  componentAllPropsNames: readonly string[],
} & TOmitKey<TRect, 'height'>

export const setDropdownHeight = 34

export const SetDropdown = pureComponent(
  startWithType<TSetDropdownProps>(),
  mapHandlers({
    onChange: ({ onChange }) => (value) => onChange(Number(value)),
  })
)(({ value, width, top, left, componentAllPropsNames, onChange }) => (
  <Dropdown
    left={left}
    top={top}
    width={width}
    height={setDropdownHeight}
    options={componentAllPropsNames.map((_: any, i: number) => ({ label: componentAllPropsNames[i], value: String(i) }))}
    value={String(value)}
    onChange={onChange}
  />
))

SetDropdown.displayName = 'SetDropdown'
