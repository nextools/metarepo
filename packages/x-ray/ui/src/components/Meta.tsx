import React from 'react'
import { component, startWithType, mapState, onUpdateAsync, mapContext } from 'refun'
import { PrimitiveText as Text } from '@revert/text'
import { PrimitiveBlock as Block } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { TJsonValue } from 'typeon'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { apiLoadMeta } from '../api/load-meta'

export type TMeta = {
  id: string,
}

export const Meta = component(
  startWithType<TMeta>(),
  mapContext(LayoutContext),
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
)(({ _top, _left, _width, _height, state }) => {
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
