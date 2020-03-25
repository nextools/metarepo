import React from 'react'
import { Text, Linking } from 'react-native'
import { component, mapHandlers, startWithType } from 'refun'
import { isFunction } from 'tsfn'
import { TSizeLink } from './types'

export const SizeLink = component(
  startWithType<TSizeLink>(),
  mapHandlers({
    onPress: ({ href, onPress }) => async () => {
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

SizeLink.displayName = 'Link'
