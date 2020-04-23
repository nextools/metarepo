import React from 'react'
import { component, startWithType, mapState, mapContext, onUpdateAsync } from 'refun'
import { PrimitiveText as Text } from '@revert/text'
import { LayoutContext } from '@revert/layout'
import { PrimitiveBlock as Block } from '@revert/block'
import { TSnapshotGridItem } from '../types'
import { mapStoreDispatch } from '../store'
import { apiLoadSnapshot } from '../api'
import { actionError } from '../actions'
import { apiLoadMeta } from '../api/load-meta'

const LINE_HEIGHT = 18
const CHAR_WIDTH = 8.39

export type TSnapshotPreview = {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>(),
  mapContext(LayoutContext),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as string[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const [data, meta] = yield Promise.all([
        apiLoadSnapshot({
          id: props.current.item.id,
          type: 'NEW',
        }),
        apiLoadMeta({
          id: props.current.item.id,
        }),
      ])
      const lines = data.split('\n')

      console.log(meta)

      props.current.setState(lines)
    } catch (err) {
      console.log(err)
      props.current.dispatch(actionError(err.message))
    }
  }, [])
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
          {/* {line.type === 'added' && (
            <Background color={COLOR_LINE_BG_ADDED}/>
          )}
          {line.type === 'removed' && (
            <Background color={COLOR_LINE_BG_REMOVED}/>
          )} */}
          <Block>
            <Text
              fontFamily="monospace"
              fontSize={14}
              lineHeight={LINE_HEIGHT}
              shouldPreserveWhitespace
            >
              {line}
            </Text>
          </Block>
        </Block>
      ))}
    </Block>
  )
})

SnapshotPreview.displayName = 'SnapshotPreview'
