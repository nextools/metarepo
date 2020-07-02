import { useContext, Context, useRef, useEffect, useState } from 'react'
import { Store } from 'redux'
import { EMPTY_OBJECT, TExtend, EMPTY_ARRAY, NOOP } from 'tsfn'
import { shallowEqualByKeys } from './utils'

export const ReduxStateFactory = <S>(context: Context<Store<S>>) => <P extends {}, SP extends {}>(mapStateToProps: (state: S) => SP, stateKeysToWatch: (keyof S)[]) =>
  (props: P): TExtend<P, SP> => {
    const [, rerender] = useState(EMPTY_OBJECT)
    const prevStateRef = useRef<S>(EMPTY_OBJECT)
    const prevStatePropsRef = useRef<SP>(EMPTY_OBJECT)
    const store = useContext(context)
    const onMountRef = useRef<() => void>(NOOP)

    if (prevStatePropsRef.current === EMPTY_OBJECT) {
      const newState = store.getState()

      prevStateRef.current = newState
      prevStatePropsRef.current = mapStateToProps(newState)
    }

    if (onMountRef.current === NOOP) {
      onMountRef.current = () => store.subscribe(() => {
        const newState = store.getState()

        if (!shallowEqualByKeys(prevStateRef.current, newState, stateKeysToWatch)) {
          prevStatePropsRef.current = mapStateToProps(newState)

          rerender({})
        }

        prevStateRef.current = newState
      })
    }

    useEffect(onMountRef.current, EMPTY_ARRAY)

    return {
      ...props,
      ...prevStatePropsRef.current,
    }
  }
