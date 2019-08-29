import { createElement } from 'react'

export const Platform = {
  select: () => () => ({}),
}

export const StyleSheet = {
  create: () => ({}),
}

export const Dimensions = {
  get: () => ({}),
}

class TheValue {
  interpolate(x) {
    return x
  }
}

export const Animated = {
  View: (props) => createElement('Animated.View', props),
  Value: TheValue,
  timing: () => ({
    start: () => {},
  }),
}

export const View = (props) => createElement('View', props)

export const Text = (props) => createElement('Text', props)

export const TextInput = (props) => createElement('TextInput', props)

export const Picker = (props) => createElement('Picker', props)

Picker.Item = (props) => createElement('Picker.Item', props)

export const Modal = (props) => createElement('Modal', props)

export const TouchableWithoutFeedback = (props) => createElement('TouchableWithoutFeedback', props)

export const TouchableOpacity = (props) => createElement('TouchableOpacity', props)

export const Image = (props) => createElement('Image', props)

export const ScrollView = (props) => createElement('ScrollView', props)

export const Switch = (props) => createElement('Switch', props)
