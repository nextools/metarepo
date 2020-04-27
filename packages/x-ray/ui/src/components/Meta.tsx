import React from 'react'
import { component, startWithType, mapState, onUpdateAsync, mapContext } from 'refun'
import { TJsonValue } from 'typeon'
import { mapStoreDispatch } from '../store'
import { actionError } from '../actions'
import { apiLoadMeta } from '../api/load-meta'
import { TRect } from '../types'
import { RenderMetaContext } from '../context/RenderMeta'
import { Block } from './Block'

export type TMeta = TRect & {
  id: string,
}

export const Meta = component(
  startWithType<TMeta>(),
  mapStoreDispatch('dispatch'),
  mapState('state', 'setState', () => null as TJsonValue | null, []),
  mapContext(RenderMetaContext),
  onUpdateAsync((props) => function *() {
    try {
      const meta = yield apiLoadMeta({
        id: props.current.id,
      })

      props.current.setState(meta)
    } catch (err) {
      console.error(err)
      props.current.dispatch(actionError(err.message))
    }
  }, [])
)(({ top, left, width, height, state, renderMeta }) => {
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
      {renderMeta(state)}
    </Block>
  )
})

Meta.displayName = 'Meta'
