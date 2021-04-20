import { PrimitiveButton as Button } from '@revert/button'
import { PrimitiveSize as Size } from '@revert/size'
import { startWithType, component, mapHandlers, mapState, mapWithProps, mapContext, mapWithPropsMemo } from 'refun'
import { actionAddFilter, actionRemoveFilter, actionResetFilter } from '../actions'
import {
  COL_SPACE,
  COLOR_WHITE,
  COLOR_GREY,
  BORDER_SIZE_SMAL,
  COLOR_DARK_GREY,
  COLOR_DM_DARK_GREY,
  COLOR_DM_LIGHT_GREY,
} from '../config'
import { ThemeContext } from '../context/Theme'
import { mapStoreDispatch } from '../store'
import type { TPosition } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Border } from './Border'
import { Switch, SWITCH_HEIGHT } from './Switch'
import { Text } from './Text'

export const TOOLBAR_SPACING = COL_SPACE
export const TOOLBAR_WIDTH = TOOLBAR_SPACING * 2 + 140
export const CONTROLS_HEIGHT = 48
const RESET_BUTTON_HORIZONTAL_PADDING = 14
const RESET_BUTTON_VERTICAL_PADDING = 6
const RESET_BUTTON_BORDER_RADIUS = 14
const RESET_BUTTON_FONT_SIZE = 13

export type TToolbar = TPosition & {
  files: string[],
  filteredFiles: string[],
  height: number,
}

type TControls = {
  filteredFiles: string[],
  onResetFilter: () => void,
}

const Controls = component(
  startWithType<TControls>(),
  mapState('resetTextWidth', 'setResetTextWidth', () => 0, []),
  mapState('resetTextHeight', 'setResetTextHeight', () => 0, []),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      background: darkMode ? COLOR_DM_DARK_GREY : COLOR_WHITE,
      border: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_GREY,
    },
  }), ['darkMode']),
  mapWithProps(({ resetTextWidth, resetTextHeight }) => ({
    resetButtonWidth: resetTextWidth + RESET_BUTTON_HORIZONTAL_PADDING * 2,
    resetButtonHeight: resetTextHeight + RESET_BUTTON_VERTICAL_PADDING * 2,
  }))
)((props) => (
  <Block
    top={0}
    left={0}
    width={TOOLBAR_WIDTH}
    height={CONTROLS_HEIGHT}
  >
    <Background color={props.color.background}/>
    <Border
      color={props.color.border}
      borderBottomWidth={BORDER_SIZE_SMAL}
    />
    <Block
      top={CONTROLS_HEIGHT / 2 - props.resetButtonHeight / 2 - BORDER_SIZE_SMAL}
      left={TOOLBAR_WIDTH / 2 - props.resetButtonWidth / 2}
      width={props.resetTextWidth + RESET_BUTTON_HORIZONTAL_PADDING * 2}
      height={props.resetTextHeight + RESET_BUTTON_VERTICAL_PADDING * 2}
      opacity={props.filteredFiles.length > 0 ? 1 : 0.4}
    >
      <Background
        color={COLOR_GREY}
        radius={RESET_BUTTON_BORDER_RADIUS}
      />
      <Block
        top={RESET_BUTTON_VERTICAL_PADDING}
        left={RESET_BUTTON_HORIZONTAL_PADDING}
      >
        <Button onPress={props.onResetFilter}>
          <Size
            width={props.resetTextWidth}
            height={props.resetTextHeight}
            onWidthChange={props.setResetTextWidth}
            onHeightChange={props.setResetTextHeight}
          >
            <Text
              color={COLOR_DARK_GREY}
              fontSize={RESET_BUTTON_FONT_SIZE}
              fontWeight={600}
              fontFamily="sans-serif"
              shouldPreserveWhitespace
            >
              Reset
            </Text>
          </Size>
        </Button>
      </Block>
    </Block>
  </Block>
))

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapStoreDispatch('dispatch'),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      background: darkMode ? COLOR_DM_DARK_GREY : COLOR_WHITE,
      border: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_GREY,
    },
  }), ['darkMode']),
  mapHandlers({
    onSwitchToggle: ({ dispatch }) => (file: string, isActive: boolean) => {
      dispatch(isActive ? actionAddFilter(file) : actionRemoveFilter(file))
    },
    onResetFilter: ({ dispatch }) => () => {
      dispatch(actionResetFilter())
    },
  })
)(({ color, files, filteredFiles, height, onSwitchToggle, onResetFilter }) => (
  <Block
    left={0}
    top={0}
    width={TOOLBAR_WIDTH}
    height={height}
  >
    <Block
      height={height}
      width={TOOLBAR_WIDTH}
      shouldFlow
    >
      <Background color={color.background}/>
      <Border
        color={color.border}
        borderRightWidth={BORDER_SIZE_SMAL}
      />
    </Block>
    <Controls
      filteredFiles={filteredFiles}
      onResetFilter={onResetFilter}
    />
    <Block
      top={CONTROLS_HEIGHT}
      left={0}
      width={TOOLBAR_WIDTH}
      height={height - CONTROLS_HEIGHT}
      shouldScrollY
    >
      {
      files.map((switchWidth, i) => {
        const top = i * SWITCH_HEIGHT
        const file = files[i]

        return (
          <Switch
            key={i}
            top={top}
            left={0}
            width={TOOLBAR_WIDTH}
            file={file}
            filteredFiles={filteredFiles}
            onToggle={onSwitchToggle}
          />
        )
      })
    }
    </Block>
  </Block>
))
