import { nanoid } from 'nanoid/non-secure'
import { useRef } from 'react'
import type { TExtend } from 'tsfn'
import { UNDEFINED } from 'tsfn'
import type { TPrimitiveInput } from './types'

export const mapUniqueId = () => <P extends { type?: TPrimitiveInput['type'] }>(props: P): TExtend<P, { uniqueId?: string }> => {
  const uniqueIdRef = useRef<any>(UNDEFINED)

  if (uniqueIdRef.current === UNDEFINED && props.type === 'number') {
    uniqueIdRef.current = nanoid()
  }

  return {
    ...props,
    uniqueId: uniqueIdRef.current,
  }
}
