import { PrimitiveBlock } from '@revert/block'
import { colorToString } from '@revert/color'
import { diffArrays } from 'diff'
import { startWithType, mapState, mapWithPropsMemo, pureComponent, onUpdateAsync, mapContext } from 'refun'
import { isDefined } from 'tsfn'
import { actionError } from '../actions'
import { apiLoadSnapshot } from '../api'
import {
  SNAPSHOT_GRID_FONT_SIZE,
  SNAPSHOT_GRID_LINE_HEIGHT,
  COLOR_LINE_BG_ADDED,
  DISCARD_ALPHA,
  BORDER_SIZE,
  SNAPSHOT_GRID_MAX_LINES,
  DASH_SPACE,
  COLOR_WHITE,
  COLOR_ORANGE,
  COLOR_DM_BLACK,
  COLOR_DM_LIGHT_GREY,
  COLOR_DM_GREY,
  COLOR_DM_LINE_BG_ADDED,
  COLOR_DM_LINE_BG_REMOVED,
  COLOR_LINE_BG_REMOVED,
  COLOR_DARK_GREY,
} from '../config'
import { ThemeContext } from '../context/Theme'
import { mapStoreDispatch } from '../store'
import type { TRect } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Text } from './Text'

export type TDiffLine = {
  value: string,
  type?: 'added' | 'removed',
}

export type TSnapshotDiff = TRect & {
  id: string,
  isDiscarded: boolean,
}

// TODO: Background VS Text z-index

export const SnapshotDiff = pureComponent(
  startWithType<TSnapshotDiff>(),
  mapStoreDispatch('dispatch'),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      border: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
      background: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_WHITE,
      font: darkMode ? COLOR_DM_GREY : COLOR_DARK_GREY,
      addedLine: darkMode ? COLOR_DM_LINE_BG_ADDED : COLOR_LINE_BG_ADDED,
      removedLine: darkMode ? COLOR_DM_LINE_BG_REMOVED : COLOR_LINE_BG_REMOVED,
    },
  }), ['darkMode']),
  mapState('state', 'setState', () => null as TDiffLine[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const [dataOrig, dataNew] = yield Promise.all([
        apiLoadSnapshot({ id: props.current.id, type: 'ORIG' }),
        apiLoadSnapshot({ id: props.current.id, type: 'NEW' }),
      ])
      const linesOrig = dataOrig.split('\n') as string[]
      const linesNew = dataNew.split('\n') as string[]
      const linesDiff = diffArrays(linesOrig, linesNew).reduce((result, chunk) => {
        result.push(
          ...chunk.value.map((line) => {
            if (chunk.added === true) {
              return {
                value: line,
                type: 'added' as const,
              }
            }

            if (chunk.removed === true) {
              return {
                value: line,
                type: 'removed' as const,
              }
            }

            return {
              value: line,
            }
          })
        )

        return result
      }, [] as TDiffLine[])

      console.log(linesDiff)

      props.current.setState(linesDiff)
    } catch (err) {
      console.error(err)
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

    const firstChangedLineIndex = state.findIndex((line) => isDefined(line.type))
    const removeTotalLinesCount = state.length - SNAPSHOT_GRID_MAX_LINES
    const removeTopLinesCount = Math.min(removeTotalLinesCount, firstChangedLineIndex)

    return {
      lines: state.slice(removeTopLinesCount, removeTopLinesCount + SNAPSHOT_GRID_MAX_LINES),
    }
  }, ['state'])
)(({ color, lines, top, left, width, height, isDiscarded }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      backgroundImage: `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_ORANGE)} ${BORDER_SIZE}px,${colorToString(COLOR_ORANGE)} ${DASH_SPACE}px)`,
    }}
  >
    <Block
      top={0}
      left={0}
      width={width}
      height={height - BORDER_SIZE}
      shouldHideOverflow
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
          <Background color={color.background}/>
          {line.type === 'added' && (
            <Background color={color.addedLine}/>
          )}
          {line.type === 'removed' && (
            <Background color={color.removedLine}/>
          )}
          <PrimitiveBlock>
            <Text
              color={color.font}
              fontFamily="monospace"
              fontSize={SNAPSHOT_GRID_FONT_SIZE}
              lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
              shouldPreserveWhitespace
              shouldPreventSelection
            >
              {line.value}
            </Text>
          </PrimitiveBlock>
        </Block>
      ))}
    </Block>
  </Block>
))

SnapshotDiff.displayName = 'SnapshotDiff'
