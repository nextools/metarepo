import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, mapWithProps, onMount, mapContext } from 'refun'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { Background, PrimitiveBackground } from '@revert/background'
import { Button } from '@revert/button'
import { Block, PrimitiveBlock } from '@revert/block'
import { Layout, LayoutContext, Layout_Item } from '@revert/layout'
import { Text } from '@revert/text'
import { mapStoreDispatch } from '../store'
import { TType, TGridItem, TSnapshotGridItem, TScreenshotGridItem } from '../types'
import { actionDeselect, actionDiscardItem } from '../actions'
import { COLOR_RED, COLOR_GREEN } from '../config'
import { onKeyDown } from '../maps/on-keydown'
import { actionUndiscardItem } from '../actions/undiscard'
import { ScreenshotPreview } from './ScreenshotPreview'
import { SnapshotPreview } from './SnapshotPreview'

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

export type TPopup = {
  type: TType,
  item: TGridItem,
  discardedItems: string[],
}

export const Popup = component(
  startWithType<TPopup>(),
  mapContext(LayoutContext),
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
  mapWithProps(({ _top, _left, _width, _height, state, item }) => {
    const shouldNotAnimate = state === STATE_OPEN || state === STATE_CLOSE

    if (state === STATE_OPENING || state === STATE_OPEN) {
      return {
        popupLeft: _left + POPUP_OFFSET,
        popupTop: _top + POPUP_OFFSET,
        popupWidth: _width - POPUP_OFFSET * 2,
        popupHeight: _height - POPUP_OFFSET * 2,
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
  onMount(({ setState }) => {
    setState(STATE_OPENING)
  }),
  mapWithProps(({ popupWidth, popupHeight }) => {
    const halfWidth = popupWidth / 2
    const hasSourceCode = false
    // const hasSourceCode = objectHas(item, 'source')

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
  state,
  item,
  type,
  backdropAlpha,
  popupAlpha,
  popupLeft,
  popupTop,
  popupWidth,
  popupHeight,
  shouldNotAnimate,
  isDiscarded,
  onDiscardToggle,
  onBackdropPress,
  onAnimationEnd,
}) => (
  <Block>
    <Animation
      time={300}
      values={[popupLeft, popupTop, popupWidth, popupHeight, popupAlpha, backdropAlpha]}
      easing={easeInOutCubic}
      onAnimationEnd={onAnimationEnd}
      shouldNotAnimate={shouldNotAnimate}
    >
      {([popupLeft, popupTop, popupWidth, popupHeight, popupAlpha, backdropAlpha]) => (
        <Fragment>
          <Button
            onPress={onBackdropPress}
          >
            <Background color={[0, 0, 0, backdropAlpha]}/>
          </Button>
          <PrimitiveBlock
            left={popupLeft}
            top={popupTop}
            width={popupWidth}
            height={popupHeight}
          >
            <PrimitiveBackground color={[255, 255, 255, popupAlpha]}/>
          </PrimitiveBlock>
        </Fragment>
      )}
    </Animation>
    {state === STATE_OPEN && item !== null && (
      <Layout direction="vertical" hPadding={POPUP_OFFSET} vPadding={POPUP_OFFSET}>
        <Layout_Item hAlign="center" height={DISCARD_BUTTON_HEIGHT}>
          <Background color={isDiscarded ? COLOR_GREEN : COLOR_RED}/>
          <Button onPress={onDiscardToggle}>
            <Text
              lineHeight={DISCARD_LINE_HEIGHT}
              fontSize={DISCARD_FONT_SIZE}
              fontFamily="sans-serif"
              shouldPreserveWhitespace
            >
              {isDiscarded ? 'Undiscard' : 'Discard'}
            </Text>
          </Button>
        </Layout_Item>
        {isScreenshotGridItem(type, item) && (
          <Layout_Item>
            <ScreenshotPreview item={item}/>
          </Layout_Item>
        )}
        {isSnapshotGridItem(type, item) && (
          <Layout_Item>
            <SnapshotPreview item={item}/>
          </Layout_Item>
        )}
      </Layout>
    )}
  </Block>
))

Popup.displayName = 'Popup'
