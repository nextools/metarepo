import React from 'react'
import { TLine } from 'syntx'
import { pureComponent, startWithType, mapContext, mapWithProps, mapHandlers, mapState } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { LayoutContext } from '../layout-context'
import { mapStoreState } from '../../store'
import { ThemeContext } from '../theme-context'
import { Line } from './Line'
import { collapseLines } from './collapse-lines'
import { getCollapsibleLineIndexes } from './get-collapsible-lines'

export type TLinesBlock = {
  lines: readonly TLine[],
}

export const LinesBlock = pureComponent(
  startWithType<TLinesBlock>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapStoreState(({ selectedElementPath }) => ({
    selectedElementPath,
  }), ['selectedElementPath']),
  mapState('collapsedMetas', 'setCollapsedMetas', () => [] as string[], []),
  mapHandlers({
    onCollapse: ({ collapsedMetas, setCollapsedMetas }) => (meta: string) => {
      if (collapsedMetas.includes(meta)) {
        setCollapsedMetas(collapsedMetas.filter((collapsedMeta) => collapsedMeta !== meta))
      } else {
        setCollapsedMetas(collapsedMetas.concat(meta))
      }
    },
  }),
  mapWithProps(({ lines, collapsedMetas }) => ({
    collapsibleLines: getCollapsibleLineIndexes(lines),
    lines: collapseLines(lines, collapsedMetas),
  })),
  mapWithProps(({ _width, _parentWidth }) => ({
    lineWidth: Math.max(_width, _parentWidth),
  }))
)(({
  lineWidth,
  lines,
  collapsibleLines,
  collapsedMetas,
  theme,
  selectedElementPath,
  onCollapse,
}) => (
  <Layout direction="vertical" vPadding={15}>
    {lines.map((line, i) => line !== null && (
      <Layout_Item key={i} height={LAYOUT_SIZE_FIT}>
        <Line
          line={line}
          lineWidth={lineWidth}
          index={i}
          theme={theme}
          isCollapsed={collapsedMetas.includes(line.meta)}
          isCollapsible={collapsibleLines.includes(i)}
          selectedElementPath={selectedElementPath}
          onCollapse={onCollapse}
        />
      </Layout_Item>
    ))}
  </Layout>
))

LinesBlock.displayName = 'LinesBlock'
