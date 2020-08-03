import React from 'react'
import type { FC } from 'react'
import { View, Text, Platform } from 'react-native'
import { Svg, Circle } from 'react-native-svg'

export const App: FC<{}> = () => (
  <View style={{ marginTop: 100 }}>
    <Text
      style={{
        fontSize: 32,
        ...Platform.select({
          ios: { fontFamily: 'Precious' },
          android: { fontFamily: 'Precious-Regular' },
        }),
      }}
    >
      Hello
    </Text>

    <Svg height={100} width={100} viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
    </Svg>
  </View>
)
