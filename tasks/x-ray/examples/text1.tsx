import React, { FC } from 'react'
import { Text as NativeText } from 'react-native'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Text: FC<{ i: number }> = ({ i }) => (
  <NativeText>{i}</NativeText>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Text i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Text, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Text1'
