import React from 'react'
import { startWithType, component, onMount, mapHandlers, mapState } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { TSize } from '../types'
import { actionError } from '../actions'

export type TScreenshot = TSize & TApiLoadScreenshotOpts

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch,
  mapState('src', 'setSrc', () => null as string | null, []),
  onMount(({ dispatch, setSrc, ...opts }) => {
    let isMounted = true

    ;(async () => {
      try {
        const blob = await apiLoadScreenshot(opts)
        const url = URL.createObjectURL(blob)

        if (isMounted) {
          setSrc(url)
        }
      } catch (err) {
        console.log(err)
        dispatch(actionError(err.message))
      }
    })()

    return () => {
      isMounted = false
    }
  }),
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
