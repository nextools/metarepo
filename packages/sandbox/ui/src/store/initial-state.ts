import { resolutions } from '../resolutions'
import { TState } from '../types'

const initialResolutionKey = 'mobileLandscape'

export const state: TState = {
  width: resolutions[initialResolutionKey].width,
  height: resolutions[initialResolutionKey].height,
  hasGrid: false,
  shouldStretch: false,
  themeName: 'light',
  componentKey: null,
  selectedElementPath: '',
  selectedSetIndex: '0',
  resolutionKey: initialResolutionKey,
  isVisibleControls: true,
  transform: {
    x: 0,
    y: 0,
    z: 1,
  },
}
