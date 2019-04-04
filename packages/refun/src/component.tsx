/* eslint-disable import/export */
import { FC } from 'react'
import { TComponentMeta } from './types'

export function component<T1, R> (fn: (p: T1, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, T8, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => T8, fn8: (p: T8, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, T8, T9, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => T8, fn8: (p: T8, meta: TComponentMeta) => T9, fn9: (p: T9, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => T8, fn8: (p: T8, meta: TComponentMeta) => T9, fn9: (p: T9, meta: TComponentMeta) => T10, fn10: (p: T10, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => T8, fn8: (p: T8, meta: TComponentMeta) => T9, fn9: (p: T9, meta: TComponentMeta) => T10, fn10: (p: T10, meta: TComponentMeta) => T11, fn11: (p: T11, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>
export function component<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, R> (fn1: (p: T1, meta: TComponentMeta) => T2, fn2: (p: T2, meta: TComponentMeta) => T3, fn3: (p: T3, meta: TComponentMeta) => T4, fn4: (p: T4, meta: TComponentMeta) => T5, fn5: (p: T5, meta: TComponentMeta) => T6, fn6: (p: T6, meta: TComponentMeta) => T7, fn7: (p: T7, meta: TComponentMeta) => T8, fn8: (p: T8, meta: TComponentMeta) => T9, fn9: (p: T9, meta: TComponentMeta) => T10, fn10: (p: T10, meta: TComponentMeta) => T11, fn11: (p: T11, meta: TComponentMeta) => T12, fn12: (p: T12, meta: TComponentMeta) => R): (name: string, Component: FC<R>) => FC<T1>

export function component(...uses: any[]) {
  return (displayName: string, Component: FC<any>) => {
    const Result = (props: any) => Component(
      uses.reduce((props, use) => use(props, { displayName }), props)
    )
    Result.displayName = displayName

    return Result
  }
}
