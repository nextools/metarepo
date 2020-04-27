import React, { FC } from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Paragraph: FC<{ i: number }> = ({ i }) => (
  <p>{i}</p>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Paragraph i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Paragraph, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Paragraph'
