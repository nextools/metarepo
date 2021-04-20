import { colorToString } from '@revert/color'
import { startWithType, mapState, mapWithPropsMemo, pureComponent, onUpdateAsync, mapContext } from 'refun'
import { actionError } from '../actions'
import { apiLoadSnapshot } from '../api'
import {
  SNAPSHOT_GRID_FONT_SIZE,
  SNAPSHOT_GRID_LINE_HEIGHT,
  COLOR_BORDER_NEW,
  DISCARD_ALPHA,
  BORDER_SIZE,
  SNAPSHOT_GRID_MAX_LINES,
  COLOR_WHITE,
  DASH_SPACE,
  COLOR_DM_BLACK,
  COLOR_DM_GREY,
  COLOR_DM_LIGHT_GREY,
  COLOR_DARK_GREY,
} from '../config'
import { ThemeContext } from '../context/Theme'
import { mapStoreDispatch } from '../store'
import type { TRect } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Text } from './Text'

export type TSnapshotNew = TRect & {
  id: string,
  isDiscarded: boolean,
}

export const SnapshotNew = pureComponent(
  startWithType<TSnapshotNew>(),
  mapStoreDispatch('dispatch'),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      border: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
      background: darkMode ? COLOR_DM_LIGHT_GREY : COLOR_WHITE,
      font: darkMode ? COLOR_DM_GREY : COLOR_DARK_GREY,
    },
  }), ['darkMode']),
  mapState('state', 'setState', () => null as string[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const data = yield apiLoadSnapshot({ id: props.current.id, type: 'NEW' })
      const lines = data.split('\n')

      props.current.setState(lines)
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

    return {
      lines: state.slice(0, SNAPSHOT_GRID_MAX_LINES),
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
      backgroundImage: `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${DASH_SPACE}px)`,
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
          <Text
            fontFamily="monospace"
            color={color.font}
            fontSize={SNAPSHOT_GRID_FONT_SIZE}
            lineHeight={SNAPSHOT_GRID_LINE_HEIGHT}
            shouldPreserveWhitespace
            shouldPreventSelection
          >
            {line}
          </Text>
        </Block>
      ))}
    </Block>
  </Block>
))

SnapshotNew.displayName = 'SnapshotNew'
