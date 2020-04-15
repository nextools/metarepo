import React from 'react'
import { component, startWithType, mapState, onUpdateAsync } from 'refun'
import { TFileResultLine } from '@x-ray/snapshots'
import { Text } from '@primitives/text'
import { TRect, TSnapshotGridItem } from '../types'
import { mapStoreDispatch } from '../store'
import { apiLoadSnapshot } from '../api'
import { actionError } from '../actions'
import { COLOR_LINE_BG_ADDED, COLOR_LINE_BG_REMOVED } from '../config'
import { Block } from './Block'
import { Background } from './Background'

const LINE_HEIGHT = 18
const CHAR_WIDTH = 8.39

export type TSnapshotPreview = TRect & {
  item: TSnapshotGridItem,
}

export const SnapshotPreview = component(
  startWithType<TSnapshotPreview>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TFileResultLine[] | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const data: TFileResultLine[] = yield apiLoadSnapshot(props.current.item)

      props.current.setState(data)
    } catch (err) {
      console.log(err)
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
