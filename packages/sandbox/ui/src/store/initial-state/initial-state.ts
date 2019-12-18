import { resolutions } from '../../resolutions'
import { TState } from '../types'

const initialResolutionKey = 'mobileLandscape'

export const initialState: TState = {
  width: resolutions[initialResolutionKey].width,
  height: resolutions[initialResolutionKey].height,
  hasGrid: false,
  shouldStretch: false,
  shouldInspect: false,
  isCanvasDarkMode: false,
  componentKey: null,
  selectedElementPath: '',
  selectedSetIndex: '0',
  resolutionKey: initialResolutionKey,
  isNavigationSidebarVisible: true,
  isControlsSidebarVisible: true,
  transformX: 0,
  transformY: 0,
  transformZ: 1,
}
