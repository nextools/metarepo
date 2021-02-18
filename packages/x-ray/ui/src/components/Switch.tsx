import { PrimitiveCheckbox as Checkbox } from '@revert/checkbox'
import { startWithType, component, mapState, mapHandlers, mapHovered, mapContext, mapWithPropsMemo } from 'refun'
import type { TMapHovered } from 'refun'
import type { TOmitKey } from 'tsfn'
import { COLOR_WHITE, BORDER_SIZE, COLOR_LIGHT_GREY, COLOR_BLUE, COLOR_DARK_GREY, COLOR_GREY, BORDER_SIZE_SMAL, COLOR_DM_DARK_GREY, COLOR_DM_LIGHT_GREY, COLOR_DM_GREY } from '../config'
import { ThemeContext } from '../context/Theme'
import type { TRect } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Border } from './Border'
import { Text } from './Text'

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
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      background: darkMode ? COLOR_DM_DARK_GREY : COLOR_WHITE,
      activeBackground: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_LIGHT_GREY,
      font: darkMode ? COLOR_DM_GREY : COLOR_DARK_GREY,
      border: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_GREY,
    },
  }), ['darkMode']),
  mapState('isActive', 'setIsActive', ({ filteredFiles, file }) => filteredFiles.includes(file), ['filteredFiles', 'file']),
  mapHandlers({
    onToggle: ({ file, isActive, setIsActive, onToggle }) => () => {
      setIsActive(!isActive)
      onToggle(file, !isActive)
    },
  })
)(({ color, left, top, isActive, file, onToggle, width, onPointerEnter, onPointerLeave, isHovered }) => (
  <Block
    left={left}
    top={top}
    width={width}
    height={SWITCH_HEIGHT}
    isFlexbox
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
  >
    <Background
      color={isActive || isHovered
        ? color.activeBackground
        : color.background
      }
    />
    <Border
      color={isActive || isHovered ? COLOR_BLUE : color.border}
      borderRightWidth={isActive || isHovered ? BORDER_SIZE : BORDER_SIZE_SMAL}
    />
    <Checkbox
      width={width}
      height={SWITCH_HEIGHT}
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
        color={color.font}
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
