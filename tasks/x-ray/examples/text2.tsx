import React, { FC } from 'react'
import { Text as NativeText, TextStyle } from 'react-native'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Text: FC<{ i: number, style: TextStyle }> = ({ i, style }) => (
  <NativeText style={style}>{i}</NativeText>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Text style={{ fontWeight: '800' }} i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Text, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Text2'
