import React from 'react'
import { startWithType, mapState, mapWithPropsMemo, pureComponent, onUpdateAsync } from 'refun'
import { PrimitiveText as Text } from '@revert/text'
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
  DISCARD_ALPHA,
  BORDER_SIZE,
  SNAPSHOT_GRID_MAX_LINES,
} from '../config'

export type TSnapshotDeleted = TRect & {
  id: string,
  isDiscarded: boolean,
}

export const SnapshotDeleted = pureComponent(
  startWithType<TSnapshotDeleted>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as string[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const data = yield apiLoadSnapshot({ id: props.current.id, type: 'NEW' })
      const lines = data.split('\n')

      props.current.setState(lines)
    } catch (err) {
      console.log(err)
      props.current.dispatch(actionError(err.message))
    }
  }, []),
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
        <Text
          fontFamily="monospace"
          fontSize={SNAPSHOT_GRID_FONT_SIZE}
          lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
          shouldPreserveWhitespace
          shouldPreventSelection
        >
          {line}
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
