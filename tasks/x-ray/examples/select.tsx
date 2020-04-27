import React, { FC } from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Select: FC<{ i: number }> = ({ i }) => (
  <select><option>{i}</option></select>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Select i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Select, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Select'
