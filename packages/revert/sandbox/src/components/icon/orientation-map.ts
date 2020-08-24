import type { TIconOrientation } from './types'

export const orientationMap: {[k in TIconOrientation]: number} = {
  up: 0,
  left: 90,
  down: 180,
  right: 270,
}
