import { PrimitiveBlock } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { PrimitiveSize } from '@revert/size'
import { component, startWithType, mapContext, onLayout } from 'refun'
import { isFunction } from 'tsfn'
import { Text } from './Text'

const LINE_HEIGHT = 20
const LINE_PADDING_LEFT = 50
const LINE_PADDING_RIGHT = 30

export type TLine = {
  index: number,
  lineWidth: number,
  children: string,
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
  lineWidth,
  index,
  children,
}) => (
  <PrimitiveBlock left={_left} top={_top} width={lineWidth + LINE_PADDING_LEFT + LINE_PADDING_RIGHT} height={LINE_HEIGHT}>
    <PrimitiveBlock left={20}>
      <Text>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </PrimitiveBlock>
    <PrimitiveSize left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
      <Text>
        {children}
      </Text>
    </PrimitiveSize>
  </PrimitiveBlock>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_LINE')
