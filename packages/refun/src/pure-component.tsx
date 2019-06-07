/* eslint-disable import/export */
import { useRef, ReactElement, FC } from 'react'
import { EMPTY_OBJECT } from 'tsfn'
import shallowEqual from 'shallowequal'
import { TComponent } from './types'

export function pureComponent<T1, R> (fn: (p: T1) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, R> (fn1: (p: T1) => T2, fn2: (p: T2) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => R): (Component: FC<R>) => TComponent<T1>

export function pureComponent(...uses: any[]) {
  return (Component: FC<any>) => (props: any) => {
    const renderResultRef = useRef<ReactElement | null>(null)
    const prevOutPropsRef = useRef(EMPTY_OBJECT)
    const prevOutProps = prevOutPropsRef.current
    const outProps = uses.reduce((props, use) => use(props), props)

    if (prevOutProps === EMPTY_OBJECT || !shallowEqual(prevOutProps, outProps)) {
      prevOutPropsRef.current = outProps
      renderResultRef.current = Component(outProps)
    }

    return renderResultRef.current
  }
}

// export function pureComponent(...uses: any[]) {
//   return (displayComponent: FC<any>) => {
//     const MemoComponent = memo(Component)
//     const MemoRefComponent = memo(forwardRef((props: any, ref) => Component({ ...props, ref })))
//     const Result = memo((props: any) => {
//       const outProps = uses.reduce((props, use) => use(props, { displayName }), props)

//       if (isUndefined(outProps.ref)) {
//         return (
//           <MemoComponent {...outProps} />
//         )
//       }

//       return (
//         <MemoRefComponent {...outProps}/>
//       )
//     })
//     Result.displayName = displayName

//     return Result
//   }
// }
