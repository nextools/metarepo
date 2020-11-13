import { EMPTY_OBJECT } from 'tsfn'
import { resolutions } from '../resolutions'
import type { TState } from './types'

const initialResolutionKey = 'mobileLandscape'

export const initialState: TState = {
  width: resolutions[initialResolutionKey].width,
  height: resolutions[initialResolutionKey].height,
  hasGrid: false,
  shouldStretch: false,
  shouldInspect: false,
  isCanvasDarkMode: false,
  resolutionKey: initialResolutionKey,
  isNavigationSidebarVisible: true,
  isControlsSidebarVisible: true,
  transformX: 0,
  transformY: 0,
  transformZ: 1,
  propsIndex: '0',
  selectedElementPath: '',
  componentKey: null,
  // Meta State
  components: null,
  componentConfig: null,
  componentControls: null,
  Component: null,
  componentProps: EMPTY_OBJECT,
  componentPropsChildrenMap: EMPTY_OBJECT,
  packageJson: null,
  readme: null,
}
