import React from 'react'
import { startWithType, component, mapHandlers, mapWithProps } from 'refun'
import { Size } from '@primitives/size'
import { TOmitKey } from 'tsfn'
import { Button } from '@primitives/button'
import { TRect } from '../types'
import { COLOR_GREEN } from '../config'
import { Block } from './Block'
import { Text } from './Text'
import { Background } from './Background'

const SAVE_BUTTON_HORIZONTAL_PADDING = 10
const SAVE_BUTTON_LINE_HEIGHT = 18
const SAVE_BUTTON_FONT_SIZE = 16

export const SAVE_BUTTON_HEIGHT = 24

export type TSaveButton = TOmitKey<TRect, 'height'> & {
  width: number,
  onWidthChange: (width: number) => void,
  onPress: () => void,
}

export const SaveButton = component(
  startWithType<TSaveButton>(),
  mapHandlers({
    onWidthChange: ({ onWidthChange }) => (width: number) => {
      onWidthChange(width + SAVE_BUTTON_HORIZONTAL_PADDING * 2)
    },
  }),
  mapWithProps(({ width }) => ({
    textWidth: width - SAVE_BUTTON_HORIZONTAL_PADDING * 2,
  }))
)(({ left, top, width, textWidth, onWidthChange, onPress }) => (
  <Block
    left={left}
    top={top}
    width={width}
    height={SAVE_BUTTON_HEIGHT}
    isFlexbox
  >
    <Background color={COLOR_GREEN}/>
    <Button onPress={onPress}>
      <Block
        left={SAVE_BUTTON_HORIZONTAL_PADDING}
        height={SAVE_BUTTON_HEIGHT}
        top={(SAVE_BUTTON_HEIGHT - SAVE_BUTTON_LINE_HEIGHT) / 2}
        shouldIgnorePointerEvents
      >
        <Size width={textWidth} onWidthChange={onWidthChange}>
          <Text
            lineHeight={SAVE_BUTTON_LINE_HEIGHT}
            fontSize={SAVE_BUTTON_FONT_SIZE}
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
