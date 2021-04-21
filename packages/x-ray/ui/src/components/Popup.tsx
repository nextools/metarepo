import { AnimationValues, easeInOutCubic } from '@revert/animation'
import { PrimitiveBackground as Background } from '@revert/background'
import { PrimitiveButton as ButtonCore } from '@revert/button'
import { rgba } from '@revert/color'
import type { TColor } from '@revert/color'
import { PrimitiveSize as Size } from '@revert/size'
import { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onUpdate } from 'refun'
import { actionDeselect, actionDiscardItem } from '../actions'
import { actionUndiscardItem } from '../actions/undiscard'
import { COLOR_BLUE, COLOR_DARK_GREY, COLOR_GREY, BORDER_SIZE_SMAL, COLOR_WHITE } from '../config'
import { onKeyDown } from '../maps/on-keydown'
import { mapStoreDispatch } from '../store'
import type { TRect, TType, TGridItem, TSnapshotGridItem, TScreenshotGridItem } from '../types'
import { Block } from './Block'
import { Border } from './Border'
import { Meta } from './Meta'
import { ScreenshotPreview } from './ScreenshotPreview'
import { SnapshotPreview } from './SnapshotPreview'
import { Text } from './Text'

const isScreenshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TScreenshotGridItem => type === 'image' && item !== null
const isSnapshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TSnapshotGridItem => type === 'text' && item !== null

const POPUP_OFFSET = 50
const CONTROLS_HEIGHT = 48

const BUTTON_HORIZONTAL_PADDING = 14
const BUTTON_VERTICAL_PADDING = 6
const BUTTON_BORDER_RADIUS = 14

const STATE_CLOSE = 0
const STATE_OPENING = 1
const STATE_OPEN = 2
const STATE_CLOSING = 3

export type TPopup = TRect & {
  type: TType,
  item: TGridItem,
  discardedItems: string[],
}

type TButton = {
  backgroundColor: TColor,
  fontColor: TColor,
  text: string,
  textWidth: number,
  textHeight: number,
  top: number,
  left: number,
  width: number,
  height: number,
  onPress: () => void,
  onWidthChange: (w: number) => void,
  onHeightChange: (h: number) => void,
}

export const Button = component(
  startWithType<TButton>()
)(({ backgroundColor, fontColor, text, textWidth, textHeight, top, left, width, height, onPress, onWidthChange, onHeightChange }) => (
  <ButtonCore
    top={top}
    left={left}
    width={width}
    height={height}
    onPress={onPress}
  >
    <Background
      color={backgroundColor}
      radius={BUTTON_BORDER_RADIUS}
    />

    <Block
      top={BUTTON_VERTICAL_PADDING}
      left={BUTTON_HORIZONTAL_PADDING}
    >
      <Size
        width={textWidth}
        height={textHeight}
        onWidthChange={onWidthChange}
        onHeightChange={onHeightChange}
      >
        <Text
          fontSize={13}
          fontWeight={600}
          color={fontColor}
          fontFamily="sans-serif"
          shouldPreserveWhitespace
        >
          {text}
        </Text>
      </Size>
    </Block>
  </ButtonCore>
))

export const Popup = component(
  startWithType<TPopup>(),
  mapStoreDispatch('dispatch'),
  mapWithProps(({ item, discardedItems }) => ({
    isDiscarded: discardedItems.includes(item.id),
  })),
  mapState('state', 'setState', () => STATE_CLOSE, []),
  mapHandlers({
    onBackdropPress: ({ setState }) => () => {
      setState(STATE_CLOSING)
    },
    onClose: ({ dispatch, setState }) => () => {
      setState(STATE_CLOSE)
      dispatch(actionDeselect())
    },
    onOpen: ({ setState }) => () => {
      setState(STATE_OPEN)
    },
    onDiscardToggle: ({ dispatch, item, setState, isDiscarded }) => () => {
      setState(STATE_CLOSING)
      dispatch(isDiscarded ? actionUndiscardItem(item.id) : actionDiscardItem(item.id))
    },
  }),
  mapHandlers({
    onAnimationEnd: ({ state, onOpen, onClose }) => () => {
      switch (state) {
        case STATE_CLOSING: {
          onClose()

          break
        }
        case STATE_OPENING: {
          onOpen()

          break
        }
      }
    },
  }),
  onKeyDown({
    Escape: ({ onBackdropPress }) => {
      onBackdropPress()
    },
    ' ': ({ onDiscardToggle }) => {
      onDiscardToggle()
    },
  }),
  mapWithProps(({ top, left, width, height, state, item }) => {
    const shouldNotAnimate = state === STATE_OPEN || state === STATE_CLOSE
    const hasSourceCode = true

    if (state === STATE_OPENING || state === STATE_OPEN) {
      const popupLeft = left + POPUP_OFFSET
      const popupTop = top + POPUP_OFFSET
      const popupWidth = width - POPUP_OFFSET * 2
      const popupHeight = height - POPUP_OFFSET * 2
      const popupAlpha = 1
      const backdropAlpha = 0.5
      const halfWidth = popupWidth / 2

      return {
        popupLeft,
        popupTop,
        popupWidth,
        popupHeight,
        popupAlpha,
        backdropAlpha,
        shouldNotAnimate,
        sourceCodeWidth: halfWidth,
        sourceCodeHeight: popupHeight - CONTROLS_HEIGHT,
        sourceCodeLeft: popupLeft,
        sourceCodeTop: popupTop + CONTROLS_HEIGHT,
        previewWidth: hasSourceCode ? halfWidth : popupWidth,
        previewHeight: popupHeight - CONTROLS_HEIGHT,
        previewLeft: hasSourceCode ? popupLeft + halfWidth : popupLeft,
        previewTop: popupTop + CONTROLS_HEIGHT,
        hasSourceCode,
      }
    }

    const popupLeft = item.left
    const popupTop = item.top
    const popupWidth = item.gridWidth
    const popupHeight = item.gridHeight
    const popupAlpha = 0
    const backdropAlpha = 0
    const halfWidth = popupWidth / 2

    return {
      popupLeft,
      popupTop,
      popupWidth,
      popupHeight,
      popupAlpha,
      backdropAlpha,
      shouldNotAnimate,
      sourceCodeWidth: halfWidth,
      sourceCodeHeight: popupHeight - CONTROLS_HEIGHT,
      sourceCodeLeft: popupLeft,
      sourceCodeTop: popupTop + CONTROLS_HEIGHT,
      previewWidth: hasSourceCode ? halfWidth : popupWidth,
      previewHeight: popupHeight - CONTROLS_HEIGHT,
      previewLeft: hasSourceCode ? popupLeft + halfWidth : popupLeft,
      previewTop: popupTop + CONTROLS_HEIGHT,
      hasSourceCode,
    }
  }),
  onUpdate(({ setState }) => {
    setState(STATE_OPENING)
  }, []),
  mapState('discardTextWidth', 'setDiscardTextWidth', () => 0, []),
  mapState('discardTextHeight', 'setDiscardTextHeight', () => 0, []),
  mapState('closeTextWidth', 'setCloseTextWidth', () => 0, []),
  mapState('closeTextHeight', 'setCloseTextHeight', () => 0, [])
)(({
  left,
  top,
  width,
  height,
  state,
  item,
  type,
  backdropAlpha,
  popupAlpha,
  popupLeft,
  popupTop,
  popupWidth,
  popupHeight,
  sourceCodeLeft,
  sourceCodeTop,
  sourceCodeWidth,
  sourceCodeHeight,
  previewLeft,
  previewTop,
  previewWidth,
  previewHeight,
  discardTextWidth,
  discardTextHeight,
  closeTextWidth,
  closeTextHeight,
  setDiscardTextWidth,
  setDiscardTextHeight,
  setCloseTextWidth,
  setCloseTextHeight,
  shouldNotAnimate,
  isDiscarded,
  onDiscardToggle,
  onBackdropPress,
  onAnimationEnd,
  onClose,
}) => (
  <Block left={left} top={top} width={width} height={height}>
    <AnimationValues
      time={300}
      toValues={[popupLeft, popupTop, popupWidth, popupHeight, popupAlpha, backdropAlpha]}
      easing={easeInOutCubic}
      onAnimationEnd={onAnimationEnd}
      shouldNotAnimate={shouldNotAnimate}
    >
      {([popupLeft, popupTop, popupWidth, popupHeight, popupAlpha, backdropAlpha]) => (
        <Fragment>
          <Block
            left={left}
            top={top}
            width={width}
            height={height}
            style={{
              cursor: 'pointer',
            }}
            onPress={onBackdropPress}
          >
            <Background color={rgba(0, 0, 0, backdropAlpha)}/>
          </Block>
          <Block
            left={popupLeft}
            top={popupTop}
            width={popupWidth}
            height={popupHeight}
          >
            <Background color={rgba(255, 255, 255, popupAlpha)}/>
          </Block>
        </Fragment>
      )}
    </AnimationValues>
    {state === STATE_OPEN && item !== null && (
      <Fragment>
        <Block
          left={popupLeft}
          top={popupTop}
          width={popupWidth}
          height={CONTROLS_HEIGHT}
        >
          <Background color={COLOR_WHITE}/>
          <Border
            color={COLOR_GREY}
            borderBottomWidth={BORDER_SIZE_SMAL}
          />
          <Button
            top={CONTROLS_HEIGHT / 2 - (discardTextHeight + BUTTON_VERTICAL_PADDING * 2) / 2}
            left={popupWidth / 2 - (discardTextWidth + BUTTON_HORIZONTAL_PADDING * 2) / 2}
            width={discardTextWidth + BUTTON_HORIZONTAL_PADDING * 2}
            height={discardTextHeight + BUTTON_VERTICAL_PADDING * 2}
            backgroundColor={COLOR_BLUE}
            fontColor={COLOR_WHITE}
            text={isDiscarded ? 'Undiscard' : 'Discard'}
            textWidth={discardTextWidth}
            textHeight={discardTextHeight}
            onPress={onDiscardToggle}
            onWidthChange={setDiscardTextWidth}
            onHeightChange={setDiscardTextHeight}
          />
          <Button
            top={CONTROLS_HEIGHT / 2 - (closeTextHeight + BUTTON_VERTICAL_PADDING * 2) / 2}
            left={popupWidth - (closeTextWidth + BUTTON_HORIZONTAL_PADDING * 2) - 15}
            width={closeTextWidth + BUTTON_HORIZONTAL_PADDING * 2}
            height={closeTextHeight + BUTTON_VERTICAL_PADDING * 2}
            backgroundColor={COLOR_GREY}
            fontColor={COLOR_DARK_GREY}
            text="Close"
            textWidth={closeTextWidth}
            textHeight={closeTextHeight}
            onPress={onClose}
            onWidthChange={setCloseTextWidth}
            onHeightChange={setCloseTextHeight}
          />
        </Block>
        {isScreenshotGridItem(type, item) && (
          <Fragment>
            <Meta
              id={item.id}
              left={sourceCodeLeft}
              top={sourceCodeTop}
              width={sourceCodeWidth}
              height={sourceCodeHeight}
            />
            <ScreenshotPreview
              top={previewTop}
              left={previewLeft}
              width={previewWidth}
              height={previewHeight}
              item={item}
            />
          </Fragment>
        )}
        {isSnapshotGridItem(type, item) && (
          <Fragment>
            <Meta
              id={item.id}
              left={sourceCodeLeft}
              top={sourceCodeTop}
              width={sourceCodeWidth}
              height={sourceCodeHeight}
            />
            <SnapshotPreview
              item={item}
              left={previewLeft}
              top={previewTop}
              width={previewWidth}
              height={previewHeight}
            />
          </Fragment>
        )}
      </Fragment>
    )}
  </Block>
))

Popup.displayName = 'Popup'
