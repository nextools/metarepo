import { useRef, useLayoutEffect, Ref } from 'react'
import { EMPTY_OBJECT, TExtend, NOOP } from 'tsfn'

export const onLayout = <P extends {}, RN extends string, REF> (refName: RN, onLayoutHandler: (ref: REF, props: P) => void) =>
  (props: P): TExtend<P, { [k in RN]: Ref<REF> }> => {
    const ref = useRef<REF>(null)
    const propsRef = useRef<P>(EMPTY_OBJECT)
    const useEffectFnRef = useRef(NOOP)

    propsRef.current = props

    if (useEffectFnRef.current === NOOP) {
      useEffectFnRef.current = () => {
        if (ref.current !== null) {
          onLayoutHandler(ref.current, propsRef.current)
        }
      }
    }

    useLayoutEffect(useEffectFnRef.current)

    // FIXME https://github.com/microsoft/TypeScript/issues/13948
    return {
      ...props,
      [refName]: ref,
    } as any
  }
