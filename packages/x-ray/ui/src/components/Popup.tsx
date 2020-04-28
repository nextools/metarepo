import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onUpdate } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Background } from '@primitives/background'
import { Button } from '@primitives/button'
import { Size } from '@primitives/size'
import { objectHas } from 'tsfn'
import { mapStoreDispatch } from '../store'
import { TRect, TType, TGridItem, TSnapshotGridItem, TScreenshotGridItem } from '../types'
import { actionDeselect, actionDiscardItem } from '../actions'
import { COLOR_RED, COLOR_GREEN } from '../config'
import { onKeyDown } from '../maps/on-keydown'
import { actionUndiscardItem } from '../actions/undiscard'
import { SourceCode } from './SourceCode'
import { Block } from './Block'
import { ScreenshotPreview } from './ScreenshotPreview'
import { SnapshotPreview } from './SnapshotPreview'
import { Text } from './Text'

const isScreenshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TScreenshotGridItem => type === 'image' && item !== null
const isSnapshotGridItem = (type: TType | undefined, item: TGridItem | null): item is TSnapshotGridItem => type === 'text' && item !== null

const POPUP_OFFSET = 50
const POPUP_SPACING = 20
const DISCARD_BUTTON_HEIGHT = 30
const DISCARD_LINE_HEIGHT = 18
const DISCARD_FONT_SIZE = 18

const STATE_CLOSE = 0
const STATE_OPENING = 1
const STATE_OPEN = 2
const STATE_CLOSING = 3

export type TPopup = TRect & {
  type: TType,
  item: TGridItem,
  discardedItems: string[],
}

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
      dispatch(isDiscarded ? actionUndiscardItem(item.id) : actionDiscardItem(item.id))
      setState(STATE_CLOSING)
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

    if (state === STATE_OPENING || state === STATE_OPEN) {
      return {
        popupLeft: left + POPUP_OFFSET,
        popupTop: top + POPUP_OFFSET,
        popupWidth: width - POPUP_OFFSET * 2,
        popupHeight: height - POPUP_OFFSET * 2,
        popupAlpha: 1,
        backdropAlpha: 0.5,
        shouldNotAnimate,
      }
    }

    return {
      popupLeft: item.left,
      popupTop: item.top,
      popupWidth: item.gridWidth,
      popupHeight: item.gridHeight,
      popupAlpha: 0,
      backdropAlpha: 0,
      shouldNotAnimate,
    }
  }),
  onUpdate(({ setState }) => {
    setState(STATE_OPENING)
  }, []),
  mapWithProps(({ popupWidth, popupHeight, item }) => {
    const halfWidth = popupWidth / 2
    const hasSourceCode = objectHas(item, 'source')

    return ({
      sourceCodeWidth: halfWidth - POPUP_SPACING * 2,
      sourceCodeHeight: popupHeight - DISCARD_BUTTON_HEIGHT - POPUP_SPACING * 2,
      sourceCodeLeft: POPUP_SPACING,
      sourceCodeTop: DISCARD_BUTTON_HEIGHT + POPUP_SPACING,
      previewWidth: hasSourceCode ? halfWidth - POPUP_SPACING * 2 : popupWidth - POPUP_SPACING * 2,
      previewHeight: popupHeight - DISCARD_BUTTON_HEIGHT - POPUP_SPACING * 2,
      previewLeft: hasSourceCode ? halfWidth + POPUP_SPACING : POPUP_SPACING,
      previewTop: DISCARD_BUTTON_HEIGHT + POPUP_SPACING,
      hasSourceCode,
    })
  }),
  mapState('discardTextWidth', 'setDiscardTextWidth', () => 0, [])
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
  setDiscardTextWidth,
  shouldNotAnimate,
  isDiscarded,
  hasSourceCode,
  onDiscardToggle,
  onBackdropPress,
  onAnimationEnd,
}) => (
  <Block left={left} top={top} width={width} height={height}>
    <Animation
      time={300}
      values={[popupLeft, popupTop, popupWidth, popupHeight, popupAlpha, backdropAlpha]}
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
              _webOnly: {
                cursor: 'pointer',
              },
            }}
            onPress={onBackdropPress}
          >
            <Background color={[0, 0, 0, backdropAlpha]}/>
          </Block>
          <Block
            left={popupLeft}
            top={popupTop}
            width={popupWidth}
            height={popupHeight}
          >
            <Background color={[255, 255, 255, popupAlpha]}/>
            {state === STATE_OPEN && item !== null && (
              <Fragment>
                <Block width={popupWidth} height={DISCARD_BUTTON_HEIGHT} isFlexbox>
                  <Background color={isDiscarded ? COLOR_GREEN : COLOR_RED}/>
                  <Button onPress={onDiscardToggle}>
                    <Block
                      top={(DISCARD_BUTTON_HEIGHT - DISCARD_LINE_HEIGHT) / 2}
                      left={(popupWidth - discardTextWidth) / 2}
                      height={DISCARD_LINE_HEIGHT}
                      shouldIgnorePointerEvents
                    >
                      <Size width={discardTextWidth} onWidthChange={setDiscardTextWidth}>
                        <Text
                          lineHeight={DISCARD_LINE_HEIGHT}
                          fontSize={DISCARD_FONT_SIZE}
                          fontFamily="sans-serif"
                          shouldPreserveWhitespace
                        >
                          {isDiscarded ? 'Undiscard' : 'Discard'}
                        </Text>
                      </Size>
                    </Block>
                  </Button>
                </Block>
                {hasSourceCode && (
                  <SourceCode
                    top={sourceCodeTop}
                    left={sourceCodeLeft}
                    width={sourceCodeWidth}
                    height={sourceCodeHeight}
                    source={item.source!}
                  />
                )}
                {isScreenshotGridItem(type, item) && (
                  <ScreenshotPreview
                    top={previewTop}
                    left={previewLeft}
                    width={previewWidth}
                    height={previewHeight}
                    item={item}
                  />
                )}
                {isSnapshotGridItem(type, item) && (
                  <SnapshotPreview
                    top={previewTop}
                    left={previewLeft}
                    width={previewWidth}
                    height={previewHeight}
                    item={item}
                  />
                )}
              </Fragment>
            )}
          </Block>
        </Fragment>
      )}
    </Animation>
  </Block>
))

Popup.displayName = 'Popup'
