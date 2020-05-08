import React from 'react'
import { component, startWithType, mapState } from 'refun'
import { Size } from '@primitives/size'
import { TOmitKey } from 'tsfn'
import { TColor } from 'colorido'
import { Block } from '../Block'
import { Background } from '../Background'
import { TSize } from '../../types'
import { TOOLBAR_WIDTH } from '../Toolbar'
import { COLOR_WHITE, COLOR_GREY, BORDER_SIZE_SMAL, COLOR_GREEN, COLOR_ORANGE, COLOR_DARK_GREY, COLOR_RED } from '../../config'
import { Border } from '../Border'
import { SaveButton } from '../SaveButton'
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

type TInfo = {
  elements: TElements,
}

type TControls = TOmitKey<TSize, 'height'> & {
  width: number,
  elements: TElements,
  onSave: () => void,
}

type TInfoItem = {
  type: string,
  color: TColor,
  count: number,
  left: number,
  width: number,
  height: number,
  onSetWidth: (w: number) => void,
  onSetHeight: (w: number) => void,
}

const InfoItem = component(
  startWithType<TInfoItem>()
)((props) => (
  <Block
    top={CONTROLS_HEIGHT / 2 - (props.height + INFO_VERTICAL_PADDING * 2 + INFO_BORDER_WIDTH * 2) / 2}
    left={props.left}
    width={props.width + INFO_HORIZONTAL_PADDING * 2}
    height={props.height + INFO_VERTICAL_PADDING * 2}
    opacity={props.count > 0 ? 1 : 0.2}
    isFlexbox
  >
    <Border
      color={props.color}
      topWidth={INFO_BORDER_WIDTH}
      leftWidth={INFO_BORDER_WIDTH}
      rightWidth={INFO_BORDER_WIDTH}
      bottomWidth={INFO_BORDER_WIDTH}
      bottomLeftRadius={INFO_BORDER_RADIUS}
      bottomRightRadius={INFO_BORDER_RADIUS}
      topLeftRadius={INFO_BORDER_RADIUS}
      topRightRadius={INFO_BORDER_RADIUS}
    />
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
          color={COLOR_DARK_GREY}
          fontFamily="sans-serif"
          shouldPreserveWhitespace
        >
          <span>{props.type} <b>{props.count}</b></span>
        </Text>
      </Size>
    </Block>
  </Block>
))

const Info = component(
  startWithType<TInfo>(),
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
    <InfoItem
      type="New"
      color={COLOR_GREEN}
      count={props.elements.new}
      left={0}
      width={props.newWidth}
      height={props.newHeight}
      onSetWidth={props.setNewWidth}
      onSetHeight={props.setNewHeight}
    />
    <InfoItem
      type="Diff"
      color={COLOR_ORANGE}
      count={props.elements.diff}
      left={props.newWidth + INFO_HORIZONTAL_PADDING * 2 + INFO_HORIZONTAL_MARGIN}
      width={props.diffWidth}
      height={props.diffHeight}
      onSetWidth={props.setDiffWidth}
      onSetHeight={props.setDiffHeight}
    />
    <InfoItem
      type="Deleted"
      color={COLOR_RED}
      count={props.elements.deleted}
      left={props.newWidth + props.diffWidth + INFO_HORIZONTAL_PADDING * 4 + INFO_HORIZONTAL_MARGIN * 2}
      width={props.deletedWidth}
      height={props.deletedHeight}
      onSetWidth={props.setDeletedWidth}
      onSetHeight={props.setDeletedHeight}
    />
  </Block>
))

export const Controls = component(
  startWithType<TControls>(),
  mapState('saveButtonWidth', 'setSaveButtonWidth', () => 0, []),
  mapState('saveButtonHeight', 'setSaveButtonHeight', () => 0, [])
)((props) => (
  <Block
    top={0}
    left={TOOLBAR_WIDTH}
    width={props.width - TOOLBAR_WIDTH}
    height={CONTROLS_HEIGHT}
  >
    <Background color={COLOR_WHITE}/>
    <Border
      color={COLOR_GREY}
      topWidth={0}
      leftWidth={0}
      rightWidth={0}
      bottomWidth={BORDER_SIZE_SMAL}
    />
    <Info elements={props.elements}/>
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
