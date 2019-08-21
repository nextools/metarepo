import React from 'react'
import { startWithType, component, mapState, mapHandlers, mapWithProps } from 'refun'
import { Checkbox } from '@primitives/checkbox'
import { Size } from '@primitives/size'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { COLOR_GREEN, COLOR_WHITE, BORDER_WIDTH } from '../config'
import { Block } from './Block'
import { Text } from './Text'
import { Background } from './Background'
import { Border } from './Border'

export const SWITCH_HORIZONTAL_PADDING = 10
export const SWITCH_HEIGHT = 24
export const SWITCH_LINE_HEIGHT = 16

export type TSwitch = TOmitKey<TRect, 'height'> & {
  file: string,
  filteredFiles: string[],
  width: number,
  onWidthChange: (file: string, width: number) => void,
  onToggle: (file: string, isActive: boolean) => void,
}

export const Switch = component(
  startWithType<TSwitch>(),
  mapState('isActive', 'setIsActive', ({ filteredFiles, file }) => filteredFiles.includes(file), ['filteredFiles', 'file']),
  mapHandlers({
    onToggle: ({ file, isActive, setIsActive, onToggle }) => () => {
      setIsActive(!isActive)
      onToggle(file, !isActive)
    },
    onWidthChange: ({ file, onWidthChange }) => (width: number) => {
      onWidthChange(file, width + SWITCH_HORIZONTAL_PADDING * 2)
    },
  }),
  mapWithProps(({ width }) => ({
    textWidth: width - SWITCH_HORIZONTAL_PADDING * 2,
  }))
)(({ left, top, width, textWidth, isActive, file, onToggle, onWidthChange }) => (
  <Block
    left={left}
    top={top}
    width={width}
    height={SWITCH_HEIGHT}
    style={{
      display: 'flex',
    }}
  >
    <Background color={isActive ? COLOR_GREEN : COLOR_WHITE}/>
    <Border
      color={COLOR_GREEN}
      topWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      overflowTop={BORDER_WIDTH}
      overflowLeft={BORDER_WIDTH}
      overflowRight={BORDER_WIDTH}
      overflowBottom={BORDER_WIDTH}
    />
    <Checkbox
      isChecked={isActive}
      onToggle={onToggle}
    />
    <Block
      left={SWITCH_HORIZONTAL_PADDING}
      height={SWITCH_HEIGHT}
      top={(SWITCH_HEIGHT - SWITCH_LINE_HEIGHT) / 2}
      shouldIgnorePointerEvents
    >
      <Size width={textWidth} onWidthChange={onWidthChange}>
        <Text lineHeight={SWITCH_LINE_HEIGHT}>{file}</Text>
      </Size>
    </Block>
  </Block>
))
