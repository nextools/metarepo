import { AnimationValue, easeInOutCubic } from '@revert/animation'
import { PrimitiveSize as Size } from '@revert/size'
import { pipe } from 'funcom'
import { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange } from 'refun'
import { DIFF_TIMEOUT, BORDER_SIZE, COLOR_GREEN, COLOR_DARK_GREY, COLOR_RED, COLOR_LIGHT_GREEN, COLOR_LIGHT_RED } from '../config'
import type { TScreenshotGridItem, TRect } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Border } from './Border'
import { ScreenshotDeleted } from './ScreenshotDeleted'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { Text } from './Text'

const VERTICAL_PADDING = 5
const HORIZONTAL_PADDING = 12
const MARGIN = 20
const BORDER_RADIUS = 6
const BORDER_WIDTH = 2
const FONT_SIZE = 13
const FONT_WEIGHT = 400

const mapDiffState = <P extends {item: TScreenshotGridItem}>() => pipe(
  startWithType<P & {item: TScreenshotGridItem}>(),
  mapState('diffState', 'setDiffState', () => false, []),
  mapSafeTimeout('setSafeTimeout'),
  mapHandlers({
    toggleDiffState: ({ setDiffState, diffState }) => () => {
      setDiffState(!diffState)
    },
  }),
  mapRef('clearDiffTimeout', null as (() => void) | null),
  onChange(({ toggleDiffState, clearDiffTimeout, setSafeTimeout, item }) => {
    if (clearDiffTimeout.current !== null) {
      clearDiffTimeout.current()
      clearDiffTimeout.current = null
    }

    if (item.type === 'DIFF') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['diffState', 'item'])
)

export type TScreenshotPreview = TRect & {
  item: TScreenshotGridItem,
}

type TLabel = {
  type: 'NEW' | 'DELETED',
}

const Label = component(
  startWithType<TLabel>(),
  mapWithProps(({ type }) => {
    switch (type) {
      case 'NEW':
        return { color: COLOR_GREEN }
      case 'DELETED':
        return { color: COLOR_RED }
    }
  }),
  mapState('statusWidth', 'setStatusWidth', () => 0, []),
  mapState('statusHeight', 'setStatusHeight', () => 0, [])
)(({ color, type, statusWidth, setStatusWidth, statusHeight, setStatusHeight }) => (
  <Block
    top={MARGIN}
    left={MARGIN}
    width={statusWidth + HORIZONTAL_PADDING * 2}
    height={statusHeight + VERTICAL_PADDING * 2}
  >
    <Border
      color={color}
      borderWidth={BORDER_WIDTH}
      radius={BORDER_RADIUS}
    />
    <Block top={VERTICAL_PADDING} left={HORIZONTAL_PADDING}>
      <Size
        width={statusWidth}
        height={statusHeight}
        onWidthChange={setStatusWidth}
        onHeightChange={setStatusHeight}
      >
        <Text
          fontSize={FONT_SIZE}
          fontWeight={FONT_WEIGHT}
          color={COLOR_DARK_GREY}
          fontFamily="sans-serif"
          shouldPreserveWhitespace
        >
          {type}
        </Text>
      </Size>
    </Block>
  </Block>
))

export const ScreenshotPreview = component(
  startWithType<TScreenshotPreview>(),
  mapWithProps(({ width, height }) => ({
    halfWidth: width / 2,
    halfHeight: height / 2,
  })),
  mapDiffState()
)(({ top, left, width, height, halfWidth, halfHeight, item: item, diffState }) => {
  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
    >
      <Fragment>
        {item.type === 'NEW' && (
          <Fragment>
            <Background color={COLOR_LIGHT_GREEN}/>
            <Label type="NEW"/>
            <ScreenshotNew
              key={item.id}
              top={halfHeight - item.height / 2}
              left={halfWidth - item.width / 2}
              width={item.width + BORDER_SIZE * 2}
              height={item.height + BORDER_SIZE * 2}
              id={item.id}
              isDiscarded={false}
              hasNoBorder
            />
          </Fragment>
        )}

        {item.type === 'DIFF' && (
          <AnimationValue time={200} easing={easeInOutCubic} toValue={diffState ? 1 : 0}>
            {(alpha) => (
              <Fragment>
                <Background color={diffState ? COLOR_LIGHT_GREEN : COLOR_LIGHT_RED}/>
                <Label type={diffState ? 'NEW' : 'DELETED'}/>
                <ScreenshotDiff
                  key={item.id}
                  top={halfHeight - item.origHeight / 2}
                  left={halfWidth - item.origWidth / 2}
                  oldWidth={item.origWidth + BORDER_SIZE * 2}
                  oldHeight={item.origHeight + BORDER_SIZE * 2}
                  newWidth={item.width + BORDER_SIZE * 2}
                  newHeight={item.height + BORDER_SIZE * 2}
                  oldAlpha={1 - alpha}
                  newAlpha={alpha}
                  id={item.id}
                  isDiscarded={false}
                  hasNoBorder
                />
              </Fragment>
            )}
          </AnimationValue>
        )}

        {item.type === 'DELETED' && (
          <Fragment>
            <Background color={COLOR_LIGHT_RED}/>
            <Label type="DELETED"/>
            <ScreenshotDeleted
              key={item.id}
              top={halfHeight - item.height / 2}
              left={halfWidth - item.width / 2}
              width={item.width + BORDER_SIZE * 2}
              height={item.height + BORDER_SIZE * 2}
              id={item.id}
              isDiscarded={false}
              hasNoBorder
            />
          </Fragment>
        )}
      </Fragment>
    </Block>
  )
})

ScreenshotPreview.displayName = 'ScreenshotPreview'
