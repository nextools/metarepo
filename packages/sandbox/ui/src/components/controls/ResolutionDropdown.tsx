import React from 'react'
import { startWithType, mapHandlers, mapWithProps, pureComponent } from 'refun'
import { getObjectKeys } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setResolution } from '../../actions'
import { resolutions, TResolutionKey } from '../../resolutions'
import { TPosition } from '../../types'
import { Dropdown } from '../dropdown'

export const resolutionDropdownWidth = 120
export const resolutionDropdownHeight = 30

const OPTIONS = [
  { label: 'Custom', value: '-' },
  ...getObjectKeys(resolutions).map((key) => ({ label: resolutions[key].label, value: key })),
]

export type TResolutionDropdown = TPosition

export const ResolutionDropdown = pureComponent(
  startWithType<TResolutionDropdown>(),
  mapStoreState(({ resolutionKey }) => ({ resolutionKey }), ['resolutionKey']),
  mapStoreDispatch,
  mapHandlers({
    dispatchResolutionKey: ({ dispatch }) => (key: TResolutionKey | null) => dispatch(setResolution(key)),
  }),
  mapWithProps(({ resolutionKey }) => ({
    value: resolutionKey === null ? '-' : resolutionKey,
  })),
  mapHandlers({
    onChange: ({ dispatchResolutionKey }) => (value: string) => dispatchResolutionKey(value === '-' ? null : value),
  })
)(({ left, top, value, onChange }) => (
  <Dropdown
    left={left}
    top={top}
    width={resolutionDropdownWidth}
    height={resolutionDropdownHeight}
    options={OPTIONS}
    value={value}
    onChange={onChange}
  />
))

ResolutionDropdown.displayName = 'ResolutionDropdown'
