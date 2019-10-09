import { pipe } from '@psxcode/compose'
import { startWithType, mapRef, onMount, onUnmount } from 'refun'
import { MutableRefObject } from 'react'
import { TExtend } from 'tsfn'

export const onMountAsync = <P>(handler: (props: TExtend<P, { isMountedRef: MutableRefObject<boolean> }>) => Promise<void>) => pipe(
  startWithType<P>(),
  mapRef('isMountedRef', false),
  onMount((props) => {
    props.isMountedRef.current = true

    handler(props)
  }),
  onUnmount(({ isMountedRef }) => {
    isMountedRef.current = false
  })
)
