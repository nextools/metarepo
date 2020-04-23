import React from 'react'
import { Text } from 'react-native'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Text style={{ fontWeight: '800' }}>{i}</Text>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => [i],
}))(range(10))

export const name = 'Text2'
