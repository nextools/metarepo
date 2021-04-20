import { startWithType, mapHandlers, mapWithProps, pureComponent } from 'refun'
import { getObjectKeys } from 'tsfn'
import { resolutions } from '../../resolutions'
import type { TResolutionKey } from '../../resolutions'
import { mapStoreState, setResolution } from '../../store'
import { SYMBOL_DROPDOWN } from '../../symbols'
import type { TId } from '../../types'
import { Dropdown } from '../dropdown'

const OPTIONS = [
  { label: 'Custom', value: '-' },
  ...getObjectKeys(resolutions).map((key) => ({ label: resolutions[key].label, value: key })),
]

export type TResolutionDropdown = TId

export const ResolutionDropdown = pureComponent(
  startWithType<TResolutionDropdown>(),
  mapStoreState(({ resolutionKey }) => ({ resolutionKey }), ['resolutionKey']),
  mapHandlers({
    dispatchResolutionKey: () => (key: TResolutionKey | null) => setResolution(key),
  }),
  mapWithProps(({ resolutionKey }) => ({
    value: resolutionKey === null ? '-' : resolutionKey,
  })),
  mapHandlers({
    onChange: ({ dispatchResolutionKey }) => (value: string) => dispatchResolutionKey(value === '-' ? null : value),
  })
)(({ value, id, onChange }) => (
  <Dropdown
    id={id}
    options={OPTIONS}
    value={value}
    onChange={onChange}
  />
))

ResolutionDropdown.displayName = 'ResolutionDropdown'
ResolutionDropdown.componentSymbol = SYMBOL_DROPDOWN
