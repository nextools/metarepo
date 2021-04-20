import { startWithType, component, mapHandlers, mapState, onUpdateAsync } from 'refun'
import { actionError } from '../actions'
import { apiLoadScreenshot } from '../api'
import type { TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import type { TSize } from '../types'

export type TScreenshot = TSize & TApiLoadScreenshotOpts

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch('dispatch'),
  mapState('src', 'setSrc', () => null as string | null, []),
  onUpdateAsync((props) => function *() {
    const { id, type, setSrc, dispatch } = props.current

    try {
      const blob = yield apiLoadScreenshot({ id, type })
      const url = URL.createObjectURL(blob)

      setSrc(url)
    } catch (err) {
      console.error(err)
      dispatch(actionError(err.message))
    }
  }, []),
  mapHandlers({
    onLoad: ({ src }) => () => {
      URL.revokeObjectURL(src!)
    },
  })
)(({ src, width, height, onLoad }) => {
  if (src === null) {
    return null
  }

  return (
    <img
      style={{
        display: 'block',
        position: 'relative',
        width,
        height,
      }}
      src={src}
      onLoad={onLoad}
    />
  )
})

Screenshot.displayName = 'Screenshot'
