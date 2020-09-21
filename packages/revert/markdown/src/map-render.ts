import { useState, useRef } from 'react'
import { EMPTY_OBJECT, NOOP } from 'tsfn'
import type { TExtend } from 'tsfn'

export const mapRender = <N extends string, P extends {}> (stateFlusherName: N) =>
  (props: P): TExtend<P, { [K in N]: () => void }> => {
    const useStateResult = useState(EMPTY_OBJECT)
    const stateFlushRef = useRef(NOOP)

    if (stateFlushRef.current === NOOP) {
      stateFlushRef.current = () => {
        useStateResult[1]({})
      }
    }

    return {
      ...props,
      [stateFlusherName]: stateFlushRef.current,
      // FIXME: https://github.com/Microsoft/TypeScript/issues/13948
    } as any
  }
