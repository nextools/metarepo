/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { ReFps } from 'refps'

export const App = () => (
  <ReFps
    backgroundColor="black"
    strokeColor="red"
    strokeWidth={4}
    fontSize={12}
    fontColor="white"
    width={100}
    height={40}
    graphLength={10}
  />
)
