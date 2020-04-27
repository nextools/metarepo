import React, { FC } from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Input: FC<{ i: number }> = ({ i }) => (
  <input defaultValue={i}/>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Input i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Input, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Input'
