import React from 'react'
import { startWithType, component, mapState, mapHandlers, mapHovered, TMapHovered } from 'refun'
import { Checkbox } from '@primitives/checkbox'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { COLOR_WHITE, BORDER_SIZE, COLOR_LIGHT_BLUE, COLOR_BLUE, COLOR_DARK_GRAY } from '../config'
import { Block } from './Block'
import { Text } from './Text'
import { Background } from './Background'
import { Border } from './Border'

export const SWITCH_HORIZONTAL_PADDING = 10
export const SWITCH_HEIGHT = 44 + BORDER_SIZE * 2
export const SWITCH_LINE_HEIGHT = 18
export const SWITCH_FONT_SIZE = 16

export type TSwitch = TOmitKey<TRect, 'height'> & {
  file: string,
  filteredFiles: string[],
  width: number,
  onToggle: (file: string, isActive: boolean) => void,
} & TMapHovered

export const Switch = component(
  startWithType<TSwitch>(),
  mapHovered,
  mapState('isActive', 'setIsActive', ({ filteredFiles, file }) => filteredFiles.includes(file), ['filteredFiles', 'file']),
  mapHandlers({
    onToggle: ({ file, isActive, setIsActive, onToggle }) => () => {
      setIsActive(!isActive)
      onToggle(file, !isActive)
    },
  })
)(({ left, top, isActive, file, onToggle, width, onPointerEnter, onPointerLeave, isHovered }) => (
  <Block
    left={left}
    top={top}
    width={width}
    height={SWITCH_HEIGHT}
    isFlexbox
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
  >
    <Background color={isActive || isHovered ? COLOR_LIGHT_BLUE : COLOR_WHITE}/>
    <Border
      color={isActive || isHovered ? COLOR_BLUE : COLOR_LIGHT_BLUE}
      topWidth={0}
      leftWidth={0}
      rightWidth={BORDER_SIZE}
      bottomWidth={0}
    />
    <Checkbox
      isChecked={isActive}
      onToggle={onToggle}
    />
    <Block
      width={150}
      left={SWITCH_HORIZONTAL_PADDING + BORDER_SIZE}
      height={SWITCH_HEIGHT}
      top={(SWITCH_HEIGHT - SWITCH_LINE_HEIGHT) / 2}
      shouldIgnorePointerEvents
    >
      <Text
        color={COLOR_DARK_GRAY}
        lineHeight={SWITCH_LINE_HEIGHT}
        fontSize={SWITCH_FONT_SIZE}
        fontFamily="sans-serif"
        shouldPreserveWhitespace
      >
        {file}
      </Text>
    </Block>
  </Block>
))
