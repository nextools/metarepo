import { useReducer } from 'react'
import { TExtend3 } from 'tsfn'

export const mapReducer = <AT extends {}, P extends {}, R> (reducer: (state: R, action: AT) => R, getInitialState: (props: P) => R) =>
  (props: P): TExtend3<P, R, { dispatch: (arg: AT) => void }> => {
    const [state, dispatch] = useReducer(reducer, getInitialState(props))

    return {
      ...props,
      ...state,
      dispatch,
    }
  }
