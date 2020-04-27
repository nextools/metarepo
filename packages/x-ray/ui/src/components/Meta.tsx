import React from 'react'
import { component, startWithType, mapState, onUpdateAsync } from 'refun'
import { TJsonValue } from 'typeon'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { apiLoadMeta } from '../api/load-meta'
import { TRect } from '../types'
import { Block } from './Block'
import { Text } from './Text'

export type TMeta = TRect & {
  id: string,
}

export const Meta = component(
  startWithType<TMeta>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TJsonValue | null, []),
  onUpdateAsync((props) => function *() {
    try {
      const meta = yield apiLoadMeta({
        id: props.current.id,
      })

      props.current.setState(meta)
    } catch (err) {
      console.log(err)
      props.current.dispatch(actionError(err.message))
    }
  }, [])
)(({ top, left, width, height, state }) => {
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
      <Text
        fontFamily="monospace"
        fontSize={14}
        lineHeight={18}
        shouldPreserveWhitespace
      >
        {JSON.stringify(state)}
      </Text>
    </Block>
  )
})

Meta.displayName = 'Meta'
