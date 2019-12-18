import React from 'react'
import { pureComponent, startWithType, mapContext, mapWithProps } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { LayoutContext } from '../layout-context'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { Line } from './Line'

export type TLinesBlock = {
  lines: readonly string[],
}

export const LinesBlock = pureComponent(
  startWithType<TLinesBlock>(),
  mapContext(LayoutContext),
  mapWithProps(({ _width, _parentWidth }) => ({
    lineWidth: Math.max(_width, _parentWidth),
  }))
)(({ lineWidth, lines }) => (
  <Layout direction="vertical" vPadding={15}>
    {lines.map((line, i) => (
      <Layout_Item key={i} height={LAYOUT_SIZE_FIT}>
        <Line
          index={i}
          lineWidth={lineWidth}
        >
          {line}
        </Line>
      </Layout_Item>
    ))}
  </Layout>
))

LinesBlock.displayName = 'LinesBlock'
