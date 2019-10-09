import React from 'react'
import { View, Dimensions } from 'react-native'
import { normalizeStyle } from 'stili'
import {
  component,
  mapState,
  onMount,
  onUnmount,
  startWithType,
  mapHandlers,
  mapWithProps,
} from 'refun'
import { TRoot } from './types'

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
  }),
  onUnmount(({ setDimensions }) => {
    Dimensions.removeEventListener('change', setDimensions)
  }),
  mapWithProps(({ dimensions }) => ({
    styles: normalizeStyle({
      position: 'absolute',
      flexDirection: 'row',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: dimensions.width,
      height: dimensions.height,
    }),
  }))
)(({ children, dimensions, styles }) => (
  <View style={styles}>{children(dimensions)}</View>
))

Root.displayName = 'Root'
