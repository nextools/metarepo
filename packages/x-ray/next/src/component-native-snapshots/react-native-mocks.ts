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
  interpolate(x: any) {
    return x
  }
}

export const Animated = {
  View: (props: any) => createElement('Animated.View', props),
  Value: TheValue,
  timing: () => ({
    start: () => {},
  }),
}

export const View = (props: any) => createElement('View', props)

export const Text = (props: any) => createElement('Text', props)

export const TextInput = (props: any) => createElement('TextInput', props)

export const Picker = (props: any) => createElement('Picker', props)

Picker.Item = (props: any) => createElement('Picker.Item', props)

export const Modal = (props: any) => createElement('Modal', props)

export const TouchableWithoutFeedback = (props: any) => createElement('TouchableWithoutFeedback', props)

export const TouchableOpacity = (props: any) => createElement('TouchableOpacity', props)

export const Image = (props: any) => createElement('Image', props)

export const ScrollView = (props: any) => createElement('ScrollView', props)

export const Switch = (props: any) => createElement('Switch', props)
