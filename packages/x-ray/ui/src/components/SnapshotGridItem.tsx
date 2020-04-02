import React from 'react'
import { startWithType, mapState, mapWithPropsMemo, pureComponent } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { elegir } from 'elegir'
import { TColor } from 'colorido'
import { isDefined } from 'tsfn'
import { PrimitiveText as Text } from '@revert/text'
import { PrimitiveBackground as Background } from '@revert/background'
import { PrimitiveBorder as Border } from '@revert/border'
import { PrimitiveBlock as Block } from '@revert/block'
import { apiLoadSnapshot, TApiLoadSnapshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { TRect } from '../types'
import { SNAPSHOT_GRID_FONT_SIZE, SNAPSHOT_GRID_LINE_HEIGHT, COLOR_BORDER_NEW, COLOR_BORDER_DIFF, COLOR_BORDER_DELETED, COLOR_LINE_BG_ADDED, COLOR_LINE_BG_REMOVED, DISCARD_ALPHA, BORDER_SIZE, SNAPSHOT_GRID_MAX_LINES } from '../config'
import { onMountAsync } from './on-mount-async'

export type TSnapshotGridItem = TApiLoadSnapshotOpts & TRect & {
  isDiscarded: boolean,
}

export const SnapshotGridItem = pureComponent(
  startWithType<TSnapshotGridItem>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onMountAsync(async ({ setState, id, type, dispatch, isMountedRef }) => {
    try {
      const data = await apiLoadSnapshot({ id, type })

      if (isMountedRef.current) {
        setState(data)
      }
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
    }
  }),
  mapWithPropsMemo(({ type }) => ({
    borderColor: elegir(
      type === 'NEW',
      COLOR_BORDER_NEW as TColor,
      type === 'DIFF',
      COLOR_BORDER_DIFF as TColor,
      true,
      COLOR_BORDER_DELETED as TColor
    ),
  }), ['type']),
  mapWithPropsMemo(({ state, type }) => {
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

    if (type !== 'DIFF') {
      return {
        lines: state.slice(0, SNAPSHOT_GRID_MAX_LINES),
      }
    }

    const firstChangedLineIndex = state.findIndex((line) => isDefined(line.type))
    const removeTotalLinesCount = state.length - SNAPSHOT_GRID_MAX_LINES
    const removeTopLinesCount = Math.min(removeTotalLinesCount, firstChangedLineIndex)

    return {
      lines: state.slice(removeTopLinesCount, removeTopLinesCount + SNAPSHOT_GRID_MAX_LINES),
    }
  }, ['state'])
)(({ lines, top, left, width, height, borderColor, isDiscarded }) => (
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
      color={borderColor}
    />
  </Block>
))

SnapshotGridItem.displayName = 'SnapshotGridItem'
