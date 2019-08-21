import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange, onMount } from 'refun'
import { easeInOutCubic, Animation } from '@primitives/animation'
import { TRect, TScreenshotGridItem } from '../types'
import { DIFF_TIMEOUT } from '../config'
import { Block } from './Block'
import { ScreenshotDiff } from './ScreenshotDiff'
import { ScreenshotNew } from './ScreenshotNew'
import { ScreenshotDeleted } from './ScreenshotDeleted'

export type TScreenshotPreview = TRect & {
  item: TScreenshotGridItem,
}

export const ScreenshotPreview = component(
  startWithType<TScreenshotPreview>(),
  mapWithProps(({ width, height }) => ({
    halfWidth: width / 2,
    halfHeight: height / 2,
  })),
  // diff state
  mapState('diffState', 'setDiffState', () => false, []),
  mapSafeTimeout('setSafeTimeout'),
  mapHandlers({
    toggleDiffState: ({ setDiffState, diffState }) => () => {
      setDiffState(!diffState)
    },
  }),
  mapRef('clearDiffTimeout', null as any),
  onChange(({ toggleDiffState, clearDiffTimeout, setSafeTimeout, item }) => {
    if (clearDiffTimeout.current !== null) {
      clearDiffTimeout.current()
      clearDiffTimeout.current = null
    }

    if (item.type === 'diff') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['diffState', 'item']),
  onMount(({ clearDiffTimeout, toggleDiffState, setSafeTimeout, item: item }) => {
    if (item.type === 'diff') {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  })
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
            width={item.width}
            height={item.height}
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
                oldWidth={item.width}
                oldHeight={item.height}
                newWidth={item.newWidth}
                newHeight={item.newHeight}
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
            width={item.width}
            height={item.height}
            id={item.id}
            isDiscarded={false}
          />
        )}
      </Fragment>
    </Block>
  )
})

ScreenshotPreview.displayName = 'ScreenshotPreview'
