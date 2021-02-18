import { PrimitiveBlock } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { PrimitiveSize } from '@revert/size'
import { component, startWithType, mapContext, onLayout } from 'refun'
import type { TLine as TSyntxLine } from 'syntx'
import { isFunction } from 'tsfn'
import type { TTheme } from '../../types'
import { LineElement } from './LineElement'
import { Text } from './Text'

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
  onLayout(({ _height, _onHeightChange }) => {
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
    <PrimitiveSize left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
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
    </PrimitiveSize>
  </PrimitiveBlock>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_LINE')
