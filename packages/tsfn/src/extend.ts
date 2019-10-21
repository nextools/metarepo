/* eslint-disable import/export */
export type TExtend<T1 extends {}, T2 extends {}> = Pick<T1, Exclude<keyof T1, keyof T2>> & T2
export type TExtend3 <T1 extends {}, T2 extends {}, T3 extends {}> = TExtend<TExtend<T1, T2>, T3>
export type TExtend4 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}> = TExtend<TExtend3<T1, T2, T3>, T4>
export type TExtend5 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}> = TExtend<TExtend4<T1, T2, T3, T4>, T5>
export type TExtend6 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}> = TExtend<TExtend5<T1, T2, T3, T4, T5>, T6>
export type TExtend7 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}, T7 extends {}> = TExtend<TExtend6<T1, T2, T3, T4, T5, T6>, T7>
export type TExtend8 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}, T7 extends {}, T8 extends {}> = TExtend<TExtend7<T1, T2, T3, T4, T5, T6, T7>, T8>
export type TExtend9 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}, T7 extends {}, T8 extends {}, T9 extends {}> = TExtend<TExtend8<T1, T2, T3, T4, T5, T6, T7, T8>, T9>
export type TExtend10 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}, T7 extends {}, T8 extends {}, T9 extends {}, T10 extends {}> = TExtend<TExtend9<T1, T2, T3, T4, T5, T6, T7, T8, T9>, T10>
export type TExtend11 <T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}, T5 extends {}, T6 extends {}, T7 extends {}, T8 extends {}, T9 extends {}, T10 extends {}, T11 extends {}> = TExtend<TExtend10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>, T11>

export function extend<T1 extends {}, T2 extends {}>(obj1: T1, obj2: T2): TExtend<T1, T2>
export function extend<T1 extends {}, T2 extends {}, T3 extends {}>(obj1: T1, obj2: T2, obj3: T3): TExtend<TExtend<T1, T2>, T3>
export function extend<T1 extends {}, T2 extends {}, T3 extends {}, T4 extends {}>(obj1: T1, obj2: T2, obj3: T3, obj4: T4): TExtend<TExtend3<T1, T2, T3>, T4>

export function extend(...objects: any[]) {
  return Object.assign({}, ...objects)
}
