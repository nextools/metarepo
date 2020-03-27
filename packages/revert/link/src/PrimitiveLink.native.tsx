import React from 'react'
import { Text, Linking } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction } from 'tsfn'
import { TLink } from './types'

export const PrimitiveLink = component(
  startWithType<TLink>(),
  mapHandlers({
    onPress: ({ href, onPress }) => async (): Promise<void> => {
      if (isFunction(onPress)) {
        onPress()
      }

      if (typeof href === 'string') {
        const isSupported = await Linking.canOpenURL(href)

        if (isSupported) {
          await Linking.openURL(href)
        }
      }
    },
  })
)(({ children, id, onPress }) => (
  <Text testID={id} onPress={onPress}>
    {children}
  </Text>
))

PrimitiveLink.displayName = 'PrimitiveLink'
