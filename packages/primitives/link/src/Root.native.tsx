import React from 'react'
import { Text, Linking } from 'react-native'
import { component, mapHandlers, startWithType, mapWithProps } from 'refun'
import { isFunction, isString, isNumber } from 'tsfn'
import { TStyle, normalizeStyle } from 'stili'
import { TLink } from './types'

export const Link = component(
  startWithType<TLink>(),
  mapWithProps(({ underlineColor, underlineWidth, children }) => {
    const style: TStyle = ({
      borderWidth: 0,
      borderStyle: 'solid',
    })

    if (isString(underlineColor)) {
      style.borderColor = underlineColor
    }

    let wrappedChildren = children

    if (isNumber(underlineWidth)) {
      const offset = `${4 - underlineWidth}px`

      style.position = 'relative'
      style.bottom = offset
      style.borderBottomWidth = underlineWidth
      wrappedChildren = (
        <Text
          style={{
            position: 'relative',
            top: offset,
          }}
        >
          {children}
        </Text>
      )
    }

    return {
      style: normalizeStyle(style),
      children: wrappedChildren,
    }
  }),
  mapHandlers({
    onPress: ({ href, onPress }) => async () => {
      if (isFunction(onPress)) {
        onPress()
      }

      if (typeof href === 'string') {
        const isSupported = await Linking.canOpenURL(href)

        if (isSupported) {
          Linking.openURL(href)
        }
      }
    },
  })
)('Link', ({ children, id, onPress }) => (
  <Text testID={id} onPress={onPress}>
    {children}
  </Text>
))
