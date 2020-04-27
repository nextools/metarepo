import React, { FC } from 'react'
import { map, range } from 'iterama'
import { TExample } from '@x-ray/core'
import { serializeComponent } from 'syntx'

const Title1: FC<{ i: number }> = ({ i }) => (
  <h2>{i}</h2>
)

export const examples = map<number, TExample>((i) => ({
  id: String(i),
  element: <Title1 i={i}/>,
  options: {
    hasOwnWidth: true,
  },
  meta: () => serializeComponent(Title1, { i }, { indent: 2 }).map((line) => line.elements),
}))(range(10))

export const name = 'Title2'
