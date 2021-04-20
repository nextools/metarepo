import { PrimitiveText as Text } from '@revert/text'
import { diffArrays } from 'diff'
import { component, startWithType, mapState, onUpdateAsync } from 'refun'
import { actionError } from '../actions'
import { apiLoadSnapshot } from '../api'
import { COLOR_LINE_BG_REMOVED, COLOR_LINE_BG_ADDED, COLOR_LIGHT_GREY } from '../config'
import { mapStoreDispatch } from '../store'
import type { TRect, TSnapshotGridItem } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import type { TDiffLine } from './SnapshotDiff'

const LINE_HEIGHT = 18
const CHAR_WIDTH = 8.39
const MARGIN = 20

export type TSnapshotPreview = TRect & {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TDiffLine[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const [dataOrig, dataNew] = yield Promise.all([
        apiLoadSnapshot({ id: props.current.item.id, type: 'ORIG' }),
        apiLoadSnapshot({ id: props.current.item.id, type: 'NEW' }),
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

      props.current.setState(linesDiff)
    } catch (err) {
      console.error(err)
      props.current.dispatch(actionError(err.message))
    }
  }, [])
)(({ top, left, width, height, state, item }) => {
  if (state === null) {
    return null
  }

  return (
    <Block
      top={top}
      left={left}
      width={width}
      height={height}
      shouldScrollX
      shouldScrollY
    >
      <Background color={COLOR_LIGHT_GREY}/>
      <Block
        top={MARGIN}
        left={MARGIN}
        width={width - MARGIN}
        height={height - MARGIN}
        shouldScrollX
        shouldScrollY
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
    </Block>
  )
})

SnapshotPreview.displayName = 'SnapshotPreview'
