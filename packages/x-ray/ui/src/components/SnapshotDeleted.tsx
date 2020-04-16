import React from 'react'
import { startWithType, mapState, mapWithPropsMemo, pureComponent } from 'refun'
import { PrimitiveText as Text } from '@revert/text'
import { PrimitiveBackground as Background } from '@revert/background'
import { PrimitiveBorder as Border } from '@revert/border'
import { PrimitiveBlock as Block } from '@revert/block'
import { apiLoadSnapshot } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import {
  SNAPSHOT_GRID_FONT_SIZE,
  SNAPSHOT_GRID_LINE_HEIGHT,
  COLOR_BORDER_DELETED,
  COLOR_LINE_BG_ADDED,
  COLOR_LINE_BG_REMOVED,
  DISCARD_ALPHA,
  BORDER_SIZE,
  SNAPSHOT_GRID_MAX_LINES,
} from '../config'
import { onMountAsync } from './on-mount-async'

export type TFileResultLine = {
  value: string,
  type?: 'added' | 'removed',
}

export type TSnapshotDeleted = TRect & {
  id: string,
  isDiscarded: boolean,
}

export const SnapshotDeleted = pureComponent(
  startWithType<TSnapshotDeleted>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMountAsync(async ({ setState, id, dispatch, isMountedRef }) => {
    try {
      const data = await apiLoadSnapshot({ id, type: 'NEW' })

      if (isMountedRef.current) {
        setState(data)
      }
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
    }
  }),
  mapWithPropsMemo(({ state }) => {
    if (state === null) {
      return {
        lines: [],
      }
    }

    if (state.length <= SNAPSHOT_GRID_MAX_LINES) {
      return {
        lines: state,
      }
    }

    return {
      lines: state.slice(0, SNAPSHOT_GRID_MAX_LINES),
    }
  }, ['state'])
)(({ lines, top, left, width, height, isDiscarded }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
  >
    {lines.map((line, i) => (
      <Block
        key={i}
        left={BORDER_SIZE}
        top={i * SNAPSHOT_GRID_LINE_HEIGHT + BORDER_SIZE}
        height={SNAPSHOT_GRID_LINE_HEIGHT}
        width={width - BORDER_SIZE * 2}
        shouldHideOverflow
      >
        {line.type === 'added' && (
          <Background color={COLOR_LINE_BG_ADDED}/>
        )}
        {line.type === 'removed' && (
          <Background color={COLOR_LINE_BG_REMOVED}/>
        )}
        <Text
          fontFamily="monospace"
          fontSize={SNAPSHOT_GRID_FONT_SIZE}
          lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
          shouldPreserveWhitespace
          shouldPreventSelection
        >
          {line.value}
        </Text>
      </Block>
    ))}
    <Border
      width={BORDER_SIZE}
      color={COLOR_BORDER_DELETED}
    />
  </Block>
))

SnapshotDeleted.displayName = 'SnapshotDeleted'
