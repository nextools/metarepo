import { Dimensions } from 'react-native'
import type { TDimensions } from './types'

export const getDimensions = (): TDimensions => Dimensions.get('window')

export const subscribeDimensions = (cb: (dimensions: TDimensions) => void) => {
  const setDimensions = ({ window: { width, height } }: any) => cb({
    width,
    height,
  })

  Dimensions.addEventListener('change', setDimensions)

  return () => {
    Dimensions.removeEventListener('change', setDimensions)
  }
}
