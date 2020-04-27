import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange } from 'refun'
import { pipe } from '@psxcode/compose'
import { Animation, easeInOutCubic } from '@primitives/animation'
import { TScreenshotGridItem, TRect } from '../types'
import { DIFF_TIMEOUT, BORDER_SIZE } from '../config'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { ScreenshotDeleted } from './ScreenshotDeleted'
import { Block } from './Block'

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

        {item.type === 'DIFF' && (
          <Animation time={200} easing={easeInOutCubic} values={[diffState ? 1 : 0]}>
            {([alpha]) => (
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
              />
            )}
          </Animation>
        )}

        {item.type === 'DELETED' && (
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
