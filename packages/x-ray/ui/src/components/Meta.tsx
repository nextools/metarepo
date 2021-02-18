import { component, startWithType, mapState, onUpdateAsync, mapContext } from 'refun'
import type { TJsonValue } from 'typeon'
import { actionError } from '../actions'
import { apiLoadMeta } from '../api/load-meta'
import { COLOR_GREY, BORDER_SIZE_SMAL } from '../config'
import { RenderMetaContext } from '../context/RenderMeta'
import { mapStoreDispatch } from '../store'
import type { TRect } from '../types'
import { Block } from './Block'
import { Border } from './Border'

const SPACING = 20

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
      <Border
        color={COLOR_GREY}
        borderRightWidth={BORDER_SIZE_SMAL}
      />
      <Block
        top={SPACING}
        left={SPACING}
        width={width - SPACING * 2}
      >
        {renderMeta(state)}
      </Block>
    </Block>
  )
})

Meta.displayName = 'Meta'
