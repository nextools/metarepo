import { EventEmitter } from 'events'
import { createElement } from 'react'

export const ReactNativeMocks = new Proxy({}, {
  get(_, importedName: string) {
    switch (importedName) {
      case 'Platform': {
        return {
          select: () => () => ({}),
        }
      }
      case 'StyleSheet': {
        return {
          create: (style: any) => style,
          compose: (...styles: any[]) => styles.reduce((acc, style) => ({
            ...acc,
            ...style,
          }), {}),
          // TODO: ...
        }
      }
      case 'Dimensions': {
        return {
          get: () => ({}),
        }
      }
      case 'Animated': {
        return {
          View: (props: any) => createElement('Animated.View', props),
          Value: class {
            interpolate(x: any) {
              return x
            }
          },
          timing: () => ({
            start: () => {},
          }),
        }
      }
      case 'Alert': {
        return {
          alert: () => {},
        }
      }
      case 'ActionSheetIOS': {
        return {
          showActionSheetWithOptions: () => {},
          showShareActionSheetWithOptions: () => {},
        }
      }
      case 'BackHandler': {
        return new EventEmitter()
      }
      case 'PermissionsAndroid': {
        return {
          request: () => Promise.resolve('granted'),
          requestMultiple: (...permissions: string[]) => permissions.reduce((acc, permission) => ({
            ...acc,
            [permission]: 'granted',
          }), {}),
          check: () => Promise.resolve('granted'),
        }
      }
      case 'ToastAndroid': {
        return {
          show: () => {},
          showWithGravity: () => {},
          showWithGravityAndOffset: () => {},
          SHORT: 'short',
          LONG: 'long',
          TOP: 'top',
          BOTTOM: 'bottom',
          CENTER: 'center',
        }
      }
      case 'Linking': {
        const Linking: any = new EventEmitter()

        Linking.openURL = Promise.resolve()
        Linking.canOpenURL = Promise.resolve()

        Linking.openSettings = () => {}

        Linking.getInitialURL = () => null

        Linking.sendIntent = () => {}

        return Linking
      }
      case 'PixelRatio': {
        return {
          get: () => 3,
          getFontScale: () => 1,
          getPixelSizeForLayoutSize: (size: number) => size,
          roundToNearestPixel: (size: number) => size,
        }
      }
      case 'Picker': {
        const Picker: any = (props: any) => createElement('Picker', props)

        Picker.Item = (props: any) => createElement('Picker.Item', props)

        return Picker
      }
      default: {
        return (props: any) => createElement(importedName, props)
      }
    }
  },
})
