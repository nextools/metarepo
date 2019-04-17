import React from 'react'
import { View, TouchableWithoutFeedback, GestureResponderEvent, TouchableWithoutFeedbackProps } from 'react-native'
import { prefixStyle } from '@lada/prefix'
import { component, startWithType, mapHandlers, mapWithProps } from 'refun'
import { isFunction } from 'tsfn'
import { TPointer } from './types'

const defaultStyles = prefixStyle({
  flexDirection: 'row',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  alignSelf: 'stretch',
})

export const Pointer = component(
  startWithType<TPointer>(),
  mapHandlers({
    onDown: ({ onDown }) => (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent

      if (isFunction(onDown)) {
        onDown({ x: pageX, y: pageY, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false })
      }
    },
    onUp: ({ onUp }) => (e: GestureResponderEvent) => {
      const { pageX, pageY } = e.nativeEvent

      if (isFunction(onUp)) {
        onUp({ x: pageX, y: pageY, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false })
      }
    },
  }),
  mapWithProps(({ onDown, onUp }) => {
    const props: TouchableWithoutFeedbackProps = {}

    if (isFunction(onDown)) {
      props.onPressIn = onDown
    }

    if (isFunction(onUp)) {
      props.onPressOut = onUp
    }

    return props
  })
)('Pointer', ({ children, onPressIn, onPressOut }) => (
  <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
    <View style={defaultStyles}>{children}</View>
  </TouchableWithoutFeedback>
))
