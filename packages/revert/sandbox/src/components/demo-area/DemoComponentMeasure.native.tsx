import { PrimitiveTransform } from '@revert/transform'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { View } from 'react-native'
import { component, mapHandlers, mapWithPropsMemo, startWithType } from 'refun'
import { UNDEFINED } from 'tsfn'
import { round } from './round'
import type { TDemoComponent } from './types'

export const DemoComponentMeasure = component(
  startWithType<TDemoComponent>(),
  mapWithPropsMemo(({ width }) => {
    const style: ViewStyle = {
      flexDirection: 'row',
      width,
    }

    return {
      style,
    }
  }, ['width']),
  mapHandlers({
    onLayout: ({ height, onHeightChange }) => ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      const measuredHeight = round(layout.height)

      if (onHeightChange !== UNDEFINED && height !== UNDEFINED && height !== measuredHeight) {
        onHeightChange(measuredHeight)
      }
    },
  })
)(({
  left,
  top,
  style,
  onLayout,
  shouldUse3d,
  children,
}) => (
  <PrimitiveTransform x={left} y={top} hOrigin="left" vOrigin="top" shouldUse3d={shouldUse3d}>
    <View style={style} onLayout={onLayout}>
      {children}
    </View>
  </PrimitiveTransform>
))

DemoComponentMeasure.displayName = 'DemoComponentMeasure'
