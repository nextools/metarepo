import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange } from 'refun'
import { easeInOutCubic, Animation } from '@primitives/animation'
import { pipe } from '@psxcode/compose'
import { TRect, TScreenshotGridItem } from '../types'
import { DIFF_TIMEOUT, BORDER_SIZE } from '../config'
import { Block } from './Block'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { ScreenshotDeleted } from './ScreenshotDeleted'

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

    if (item.type === 'diff') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['diffState', 'item'])
)

export type TScreenshotPreview = TRect & {
  item: TScreenshotGridItem,
}

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
        {item.type === 'new' && (
          <ScreenshotNew
            key={item.id}
            top={halfHeight - item.height / 2}
            left={halfWidth - item.width / 2}
            width={item.width + BORDER_SIZE * 2}
            height={item.height + BORDER_SIZE * 2}
            id={item.id}
            isDiscarded={false}
          />
        )}

        {item.type === 'diff' && (
          <Animation time={200} easing={easeInOutCubic} values={[diffState ? 1 : 0]}>
            {([alpha]) => (
              <ScreenshotDiff
                key={item.id}
                top={halfHeight - item.height / 2}
                left={halfWidth - item.width / 2}
                oldWidth={item.width + BORDER_SIZE * 2}
                oldHeight={item.height + BORDER_SIZE * 2}
                newWidth={item.newWidth + BORDER_SIZE * 2}
                newHeight={item.newHeight + BORDER_SIZE * 2}
                oldAlpha={1 - alpha}
                newAlpha={alpha}
                id={item.id}
                isDiscarded={false}
              />
            )}
          </Animation>
        )}

        {item.type === 'deleted' && (
          <ScreenshotDeleted
            key={item.id}
            top={halfHeight - item.height / 2}
            left={halfWidth - item.width / 2}
            width={item.width + BORDER_SIZE * 2}
            height={item.height + BORDER_SIZE * 2}
            id={item.id}
            isDiscarded={false}
          />
        )}
      </Fragment>
    </Block>
  )
})

ScreenshotPreview.displayName = 'ScreenshotPreview'
