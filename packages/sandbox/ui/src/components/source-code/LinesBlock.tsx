import React from 'react'
import { TLine } from 'syntx'
import { pureComponent, startWithType } from 'refun'
import { Block } from '../block/index'
import { TTheme } from '../../types'
import { LINE_HEIGHT } from './utils'
import { Line } from './Line'

export type TLinesBlock = {
  width: number,
  lines: readonly TLine[],
  theme: TTheme,
  selectedElementPath: string,
}

export const LinesBlock = pureComponent(
  startWithType<TLinesBlock>()
)(({ width, lines, theme, selectedElementPath }) => (
  <Block
    width={width}
    height={lines.length * LINE_HEIGHT}
    shouldFlow
  >
    {lines.map((line, i) => (
      <Line
        key={i}
        line={line}
        index={i}
        theme={theme}
        selectedElementPath={selectedElementPath}
      />
    ))}
  </Block>
))
