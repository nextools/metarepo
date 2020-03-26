import React, { FC } from 'react'
import { Root } from '@primitives/root'
import { Main } from './components/Main'

export const App: FC<{}> = () => (
  <Root>
    {({ width, height }: { width: number, height: number }) => (
      <Main width={width} height={height}/>
    )}
  </Root>
)
