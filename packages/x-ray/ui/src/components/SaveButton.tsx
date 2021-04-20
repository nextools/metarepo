import { PrimitiveButton as Button } from '@revert/button'
import { PrimitiveSize as Size } from '@revert/size'
import { startWithType, component, mapHandlers, mapWithProps } from 'refun'
import { COLOR_BLUE, COLOR_WHITE, BORDER_SIZE_SMAL } from '../config'
import type { TRect } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { CONTROLS_HEIGHT } from './Main/Controls'
import { Text } from './Text'

export const SAVE_BUTTON_HORIZONTAL_PADDING = 14
const SAVE_BUTTON_VERTICAL_PADDING = 6
const SAVE_BUTTON_FONT_SIZE = 13
const SAVE_BUTTON_BORDER_RADIUS = 14

export type TSaveButton = TRect & {
  onWidthChange: (width: number) => void,
  onHeightChange: (width: number) => void,
  onPress: () => void,
}

export const SaveButton = component(
  startWithType<TSaveButton>(),
  mapHandlers({
    onWidthChange: ({ onWidthChange }) => (width: number) => {
      onWidthChange(width + SAVE_BUTTON_HORIZONTAL_PADDING * 2)
    },
  }),
  mapWithProps(({ width, height }) => ({
    textWidth: width - SAVE_BUTTON_HORIZONTAL_PADDING * 2,
    textHeight: height + SAVE_BUTTON_VERTICAL_PADDING * 2,
  }))
)(({
  left,
  width,
  textWidth,
  textHeight,
  onWidthChange,
  onHeightChange,
  onPress,
}) => (
  <Block
    top={CONTROLS_HEIGHT / 2 - textHeight / 2 - BORDER_SIZE_SMAL / 2}
    left={left}
    width={width}
    height={textHeight}
    isFlexbox
  >
    <Background
      color={COLOR_BLUE}
      radius={SAVE_BUTTON_BORDER_RADIUS}
    />
    <Button onPress={onPress}>
      <Block
        left={SAVE_BUTTON_HORIZONTAL_PADDING}
        top={SAVE_BUTTON_VERTICAL_PADDING}
        shouldIgnorePointerEvents
      >
        <Size
          width={textWidth}
          onWidthChange={onWidthChange}
          height={textHeight}
          onHeightChange={onHeightChange}
        >
          <Text
            fontSize={SAVE_BUTTON_FONT_SIZE}
            fontWeight={600}
            color={COLOR_WHITE}
            fontFamily="sans-serif"
            shouldPreserveWhitespace
          >
            Save
          </Text>
        </Size>
      </Block>
    </Button>
  </Block>
))
