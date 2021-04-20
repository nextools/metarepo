import { Button } from '@revert/button'
import type { TColor } from '@revert/color'
import { PrimitiveSize as Size } from '@revert/size'
import { component, startWithType, mapState, mapContext } from 'refun'
import {
  COLOR_WHITE,
  COLOR_GREEN,
  COLOR_ORANGE,
  COLOR_DARK_GREY,
  COLOR_RED,
} from '../../config'
import { ThemeContext } from '../../context/Theme'
import type { TTypeVariants } from '../../types'
import { Block } from '../Block'
import { Border } from '../Border'
import { Text } from '../Text'

export const CONTROLS_HEIGHT = 48
export const CONTROLS_PADDING = 18

const INFO_VERTICAL_PADDING = 5
const INFO_HORIZONTAL_PADDING = 12
const INFO_HORIZONTAL_MARGIN = 20
const INFO_BORDER_RADIUS = 6
const INFO_BORDER_WIDTH = 2
const INFO_FONT_SIZE = 13
const INFO_FONT_WEIGHT = 400

type TElements = {
  new: number,
  diff: number,
  deleted: number,
}

type TTabs = {
  activeTab: TTypeVariants | null,
  elements: TElements,
  onPress: (type: TTypeVariants) => void,
}

type TTab = {
  activeTab: TTypeVariants | null,
  color: TColor,
  count: number,
  height: number,
  left: number,
  type: TTypeVariants,
  width: number,
  onPress: (type: TTypeVariants) => void,
  onSetHeight: (w: number) => void,
  onSetWidth: (w: number) => void,
}

const Tab = component(
  startWithType<TTab>(),
  mapContext(ThemeContext)
)((props) => (
  <Block
    top={CONTROLS_HEIGHT / 2 - (props.height + INFO_VERTICAL_PADDING * 2 + INFO_BORDER_WIDTH * 2) / 2}
    left={props.left}
    width={props.width + INFO_HORIZONTAL_PADDING * 2}
    height={props.height + INFO_VERTICAL_PADDING * 2}
    opacity={props.count > 0 && (props.activeTab === null || props.activeTab === props.type) ? 1 : 0.2}
    isFlexbox
  >
    <Border
      color={props.color}
      borderWidth={INFO_BORDER_WIDTH}
      radius={INFO_BORDER_RADIUS}
    />
    <Button onPress={() => {
      props.onPress(props.type)
    }}
    >
      <Block
        top={INFO_VERTICAL_PADDING}
        left={INFO_HORIZONTAL_PADDING}
        shouldIgnorePointerEvents
      >
        <Size
          width={props.width}
          height={props.height}
          onWidthChange={props.onSetWidth}
          onHeightChange={props.onSetHeight}
        >
          <Text
            fontSize={INFO_FONT_SIZE}
            fontWeight={INFO_FONT_WEIGHT}
            color={props.darkMode ? COLOR_WHITE : COLOR_DARK_GREY}
            fontFamily="sans-serif"
            shouldPreserveWhitespace
          >
            <span>{props.type} <b>{props.count}</b></span>
          </Text>
        </Size>
      </Block>
    </Button>
  </Block>
))

export const Tabs = component(
  startWithType<TTabs>(),
  mapState('newWidth', 'setNewWidth', () => 0, []),
  mapState('newHeight', 'setNewHeight', () => 0, []),
  mapState('diffWidth', 'setDiffWidth', () => 0, []),
  mapState('diffHeight', 'setDiffHeight', () => 0, []),
  mapState('deletedWidth', 'setDeletedWidth', () => 0, []),
  mapState('deletedHeight', 'setDeletedHeight', () => 0, [])
)((props) => (
  <Block
    top={0}
    left={CONTROLS_PADDING}
  >
    <Tab
      activeTab={props.activeTab}
      type="New"
      color={COLOR_GREEN}
      count={props.elements.new}
      left={0}
      width={props.newWidth}
      height={props.newHeight}
      onPress={props.onPress}
      onSetWidth={props.setNewWidth}
      onSetHeight={props.setNewHeight}
    />
    <Tab
      activeTab={props.activeTab}
      type="Diff"
      color={COLOR_ORANGE}
      count={props.elements.diff}
      left={props.newWidth + INFO_HORIZONTAL_PADDING * 2 + INFO_HORIZONTAL_MARGIN}
      width={props.diffWidth}
      height={props.diffHeight}
      onPress={props.onPress}
      onSetWidth={props.setDiffWidth}
      onSetHeight={props.setDiffHeight}
    />
    <Tab
      activeTab={props.activeTab}
      type="Deleted"
      color={COLOR_RED}
      count={props.elements.deleted}
      left={props.newWidth + props.diffWidth + INFO_HORIZONTAL_PADDING * 4 + INFO_HORIZONTAL_MARGIN * 2}
      width={props.deletedWidth}
      height={props.deletedHeight}
      onPress={props.onPress}
      onSetWidth={props.setDeletedWidth}
      onSetHeight={props.setDeletedHeight}
    />
  </Block>
))

Tabs.displayName = 'Tabs'
