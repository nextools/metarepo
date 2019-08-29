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
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => T20, fn20: (p: T20) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => T20, fn20: (p: T20) => T21, fn21: (p: T21) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => T20, fn20: (p: T20) => T21, fn21: (p: T21) => T22, fn22: (p: T22) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => T20, fn20: (p: T20) => T21, fn21: (p: T21) => T22, fn22: (p: T22) => T23, fn23: (p: T23) => R): (Component: FC<R>) => TComponent<T1>
export function pureComponent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20, T21, T22, T23, T24, R> (fn1: (p: T1) => T2, fn2: (p: T2) => T3, fn3: (p: T3) => T4, fn4: (p: T4) => T5, fn5: (p: T5) => T6, fn6: (p: T6) => T7, fn7: (p: T7) => T8, fn8: (p: T8) => T9, fn9: (p: T9) => T10, fn10: (p: T10) => T11, fn11: (p: T11) => T12, fn12: (p: T12) => T13, fn13: (p: T13) => T14, fn14: (p: T14) => T15, fn15: (p: T15) => T16, fn16: (p: T16) => T17, fn17: (p: T17) => T18, fn18: (p: T18) => T19, fn19: (p: T19) => T20, fn20: (p: T20) => T21, fn21: (p: T21) => T22, fn22: (p: T22) => T23, fn23: (p: T23) => T24, fn24: (p: T24) => R): (Component: FC<R>) => TComponent<T1>

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
