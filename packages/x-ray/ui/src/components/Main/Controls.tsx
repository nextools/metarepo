import { Button } from '@revert/button'
import { PrimitiveSize as Size } from '@revert/size'
import { component, startWithType, mapState, mapContext, mapWithPropsMemo } from 'refun'
import type { TOmitKey } from 'tsfn'
import {
  COLOR_WHITE,
  COLOR_GREY,
  BORDER_SIZE_SMAL,
  COLOR_DARK_GREY,
  COLOR_DM_DARK_GREY,
  COLOR_DM_LIGHT_GREY,
} from '../../config'
import { ThemeContext } from '../../context/Theme'
import type { TSize, TTypeVariants } from '../../types'
import { Background } from '../Background'
import { Block } from '../Block'
import { Border } from '../Border'
import { SaveButton } from '../SaveButton'
import { Text } from '../Text'
import { TOOLBAR_WIDTH } from '../Toolbar'
import { Tabs } from './Tabs'

export const CONTROLS_HEIGHT = 48
export const CONTROLS_PADDING = 18

const SAVE_BUTTON_HORIZONTAL_PADDING = 11
const SAVE_BUTTON_VERTICAL_PADDING = 6
const SAVE_BUTTON_FONT_SIZE = 13
const SAVE_BUTTON_BORDER_RADIUS = 15
const BUTTON_HORIZONTAL_MARGIN = 20

type TElements = {
  new: number,
  diff: number,
  deleted: number,
}

type TControls = TOmitKey<TSize, 'height'> & {
  width: number,
  elements: TElements,
  activeTab: TTypeVariants | null,
  onSave: () => void,
  onTab: () => void,
}

type TThemeButton = {
  top: number,
  left: number,
  width: number,
  height: number,
  onPress: () => void,
  onWidthChange: (width: number) => void,
  onHeightChange: (width: number) => void,
}

const ThemeButton = component(
  startWithType<TThemeButton>(),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      background: darkMode ? COLOR_GREY : COLOR_DARK_GREY,
      font: darkMode ? COLOR_GREY : COLOR_DARK_GREY,
    },
  }), ['darkMode'])
)((props) => (
  <Block
    top={CONTROLS_HEIGHT / 2 - (BORDER_SIZE_SMAL + props.height + SAVE_BUTTON_VERTICAL_PADDING * 2) / 2}
    left={props.left}
    width={props.width + SAVE_BUTTON_HORIZONTAL_PADDING * 2}
    height={props.height + SAVE_BUTTON_VERTICAL_PADDING * 2}
    isFlexbox
  >
    <Background
      color={props.color.background}
      radius={SAVE_BUTTON_BORDER_RADIUS}
    />
    <Button onPress={props.onPress}>
      <Block
        left={SAVE_BUTTON_HORIZONTAL_PADDING}
        top={SAVE_BUTTON_VERTICAL_PADDING}
        shouldIgnorePointerEvents
      >
        <Size
          width={props.width}
          onWidthChange={props.onWidthChange}
          height={props.height}
          onHeightChange={props.onHeightChange}
        >
          <Text
            fontSize={SAVE_BUTTON_FONT_SIZE}
            fontWeight={600}
            color={props.darkMode ? COLOR_DARK_GREY : COLOR_WHITE}
            fontFamily="sans-serif"
            shouldPreserveWhitespace
          >
            T
          </Text>
        </Size>
      </Block>
    </Button>
  </Block>
))

export const Controls = component(
  startWithType<TControls>(),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      background: darkMode ? COLOR_DM_DARK_GREY : COLOR_WHITE,
      border: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_GREY,
    },
  }), ['darkMode']),
  mapState('saveButtonWidth', 'setSaveButtonWidth', () => 0, []),
  mapState('saveButtonHeight', 'setSaveButtonHeight', () => 0, []),
  mapState('themeButtonWidth', 'setThemeButtonWidth', () => 0, []),
  mapState('themeButtonHeight', 'setThemeButtonHeight', () => 0, [])
)((props) => (
  <Block
    top={0}
    left={TOOLBAR_WIDTH}
    width={props.width - TOOLBAR_WIDTH}
    height={CONTROLS_HEIGHT}
  >
    <Background color={props.color.background}/>
    <Border
      color={props.color.border}
      borderBottomWidth={BORDER_SIZE_SMAL}
    />
    <Tabs
      activeTab={props.activeTab}
      elements={props.elements}
      onPress={props.onTab}
    />
    <ThemeButton
      top={props.themeButtonHeight / 2}
      left={
        props.width - TOOLBAR_WIDTH - (props.saveButtonWidth + SAVE_BUTTON_HORIZONTAL_PADDING * 2) - CONTROLS_PADDING - BUTTON_HORIZONTAL_MARGIN
      }
      width={props.themeButtonWidth}
      height={props.themeButtonHeight}
      onPress={props.onToggleTheme}
      onWidthChange={props.setThemeButtonWidth}
      onHeightChange={props.setThemeButtonHeight}
    />
    <SaveButton
      top={props.saveButtonHeight / 2}
      left={props.width - TOOLBAR_WIDTH - props.saveButtonWidth - CONTROLS_PADDING}
      width={props.saveButtonWidth}
      height={props.saveButtonHeight}
      onPress={props.onSave}
      onWidthChange={props.setSaveButtonWidth}
      onHeightChange={props.setSaveButtonHeight}
    />
  </Block>
))

Controls.displayName = 'Controls'
