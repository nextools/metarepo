import React from 'react'
import { startWithType, component, mapHandlers, mapState } from 'refun'
import { apiLoadScreenshot, TApiLoadScreenshotOpts } from '../api'
import { mapStoreDispatch } from '../store'
import { TSize } from '../types'
import { actionError } from '../actions'
import { onMountAsync } from './on-mount-async'

export type TScreenshot = TSize & TApiLoadScreenshotOpts

export const Screenshot = component(
  startWithType<TScreenshot>(),
  mapStoreDispatch,
  mapState('src', 'setSrc', () => null as string | null, []),
  onMountAsync(async ({ isMountedRef, dispatch, setSrc, ...opts }) => {
    try {
      const blob = await apiLoadScreenshot(opts)
      const url = URL.createObjectURL(blob)

      if (isMountedRef.current) {
        setSrc(url)
      }
    } catch (err) {
      console.log(err)
      dispatch(actionError(err.message))
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
