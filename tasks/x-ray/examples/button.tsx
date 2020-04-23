import React, { FC } from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Component: FC<{ i: number }> = ({ i }) => (
  <button>{i}</button>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: (
    <Component i={i}/>
  ),
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Component, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Button'
