import React from 'react'
import { component, startWithType, mapState, mapContext } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { PrimitiveText as Text } from '@revert/text'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBackground as Background } from '@revert/background'
import { PrimitiveBlock as Block } from '@revert/block'
import { TSnapshotGridItem } from '../types'
import { mapStoreDispatch } from '../store'
import { apiLoadSnapshot } from '../api'
import { actionError } from '../actions'
import { COLOR_LINE_BG_ADDED, COLOR_LINE_BG_REMOVED } from '../config'
import { onMountAsync } from './on-mount-async'

const LINE_HEIGHT = 18
const CHAR_WIDTH = 8.39

export type TSnapshotPreview = {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>(),
  mapContext(LayoutContext),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMountAsync(async ({ setState, item, dispatch, isMountedRef }) => {
    try {
      const data = await apiLoadSnapshot(item)

      if (isMountedRef.current) {
        setState(data)
      }
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
    }
  })
)(({ _top, _left, _width, _height, state, item }) => {
  if (state === null) {
    return null
  }

  return (
    <Block
      top={_top}
      left={_left}
      width={_width}
      height={_height}
      shouldScroll
    >
      <Block height={state.length * LINE_HEIGHT}/>
      {state.map((line, i) => (
        <Block
          top={i * LINE_HEIGHT}
          height={LINE_HEIGHT}
          width={item.width * CHAR_WIDTH}
          key={i}
        >
          {line.type === 'added' && (
            <Background color={COLOR_LINE_BG_ADDED}/>
          )}
          {line.type === 'removed' && (
            <Background color={COLOR_LINE_BG_REMOVED}/>
          )}
          <Block>
            <Text
              fontFamily="monospace"
              fontSize={14}
              lineHeight={LINE_HEIGHT}
              shouldPreserveWhitespace
            >
              {line.value}
            </Text>
          </Block>
        </Block>
      ))}
    </Block>
  )
})

SnapshotPreview.displayName = 'SnapshotPreview'
