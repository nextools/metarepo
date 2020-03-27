import React from 'react'
import { View, TouchableWithoutFeedback, GestureResponderEvent, TouchableWithoutFeedbackProps } from 'react-native'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapHandlers, mapWithProps, mapDefaultProps } from 'refun'
import { isFunction } from 'tsfn'
import { TPointer } from './types'

const style = normalizeStyle({
  flexDirection: 'row',
  flexGrow: 1,
  flexShrink: 1,
  alignSelf: 'stretch',
})

export const Pointer = component(
  startWithType<TPointer>(),
  mapDefaultProps({
    isDisabled: false,
  }),
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
  mapWithProps(({ isDisabled, onDown, onUp }) => {
    const props: TouchableWithoutFeedbackProps = {}

    if (!isDisabled) {
      if (isFunction(onDown)) {
        props.onPressIn = onDown
      }

      if (isFunction(onUp)) {
        props.onPressOut = onUp
      }
    }

    return props
  })
)(({ children, onPressIn, onPressOut }) => (
  <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
    <View style={style}>{children}</View>
  </TouchableWithoutFeedback>
))

Pointer.displayName = 'Pointer'
