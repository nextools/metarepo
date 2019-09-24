import React from 'react'
import { startWithType, mapHandlers, mapWithProps, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../../types'
import { Dropdown } from '../dropdown'

export type TComponentDropdownProps = {
  options: {
    value: string,
    label: string,
  }[],
  value: string | null,
  onChange: (value: string | null) => void,
} & TOmitKey<TRect, 'height'>

export const componentDropdownHeight = 34

export const ComponentDropdown = pureComponent(
  startWithType<TComponentDropdownProps>(),
  mapWithProps(({ value }) => ({
    value: value === null ? '-' : value,
  })),
  mapHandlers({
    onChange: ({ onChange }) => (value: string) => onChange(value === '-' ? null : value),
  })
)(({ value, width, left, top, options, onChange }) => (
  <Dropdown
    left={left}
    top={top}
    width={width}
    height={componentDropdownHeight}
    options={options}
    value={value}
    onChange={onChange}
  />
))

ComponentDropdown.displayName = 'ComponentDropdown'
