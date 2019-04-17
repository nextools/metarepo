import React from 'react'
import { View, Dimensions } from 'react-native'
import { TStyle } from '@lada/prefix'
import {
  component,
  mapState,
  onMount,
  startWithType,
  mapHandlers,
  mapWithProps,
} from 'refun'
import { TRoot } from './types'

const defaultStyle: TStyle = {
  position: 'absolute',
  flexDirection: 'row',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

export const Root = component(
  startWithType<TRoot>(),
  mapState('dimensions', 'setDimensions', () => {
    const { width, height } = Dimensions.get('window')

    return {
      width,
      height,
    }
  }, []),
  mapHandlers({
    setDimensions: ({ setDimensions }) => ({ window: { width, height } }: any) => setDimensions({
      width,
      height,
    }),
  }),
  onMount(({ setDimensions }) => {
    Dimensions.addEventListener('change', setDimensions)

    return () => {
      Dimensions.removeEventListener('change', setDimensions)
    }
  }),
  mapWithProps(({ dimensions }) => ({
    styles: {
      ...defaultStyle,
      width: dimensions.width,
      height: dimensions.height,
    },
  }))
)('Root', ({ children, dimensions, styles }) => (
  <View style={styles}>{children(dimensions)}</View>
))
