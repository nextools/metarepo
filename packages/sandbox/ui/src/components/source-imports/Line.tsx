import React from 'react'
import { component, startWithType, mapContext, onChange } from 'refun'
import { isFunction } from 'tsfn'
import { TLine as TSyntxLine } from 'syntx'
import { PrimitiveBlock } from '../primitive-block'
import { LayoutContext } from '../layout-context'
import { Size } from '../size'
import { TTheme } from '../../types'
import { Text } from './Text'
import { LineElement } from './LineElement'

const LINE_HEIGHT = 20
const LINE_PADDING_LEFT = 50
const LINE_PADDING_RIGHT = 30

export type TLine = {
  index: number,
  lineWidth: number,
  line: TSyntxLine,
  theme: TTheme,
}

export const Line = component(
  startWithType<TLine>(),
  mapContext(LayoutContext),
  onChange(({ _height, _onHeightChange }) => {
    if (_height !== LINE_HEIGHT && isFunction(_onHeightChange)) {
      _onHeightChange(LINE_HEIGHT)
    }
  }, ['_height'])
)(({
  _left,
  _top,
  _width,
  _onWidthChange,
  line,
  lineWidth,
  index,
  theme,
}) => (
  <PrimitiveBlock left={_left} top={_top} width={lineWidth + LINE_PADDING_LEFT + LINE_PADDING_RIGHT} height={LINE_HEIGHT} shouldIgnorePointerEvents>
    <PrimitiveBlock left={20}>
      <Text color={theme.sourceCodeLineColor}>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </PrimitiveBlock>
    <Size left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
      <PrimitiveBlock shouldFlow>
        {line.elements.map(({ type, value }, i) => (
          <LineElement
            key={i}
            type={type}
            theme={theme}
          >
            {value}
          </LineElement>
        ))}
      </PrimitiveBlock>
    </Size>
  </PrimitiveBlock>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_LINE')
