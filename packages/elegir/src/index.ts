/* eslint-disable import/export */
export function elegir <B0 extends boolean, T0>(b0: B0, v0: T0): B0 extends true ? T0 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1>(b0: B0, v0: T0, b1: B1, v1: T1): B0 extends true ? T0 : B1 extends true ? T1 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3, B4 extends boolean, T4>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3, b4: B4, v4: T4): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : B4 extends true ? T4 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3, B4 extends boolean, T4, B5 extends boolean, T5>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3, b4: B4, v4: T4, b5: B5, v5: T5): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : B4 extends true ? T4 : B5 extends true ? T5 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3, B4 extends boolean, T4, B5 extends boolean, T5, B6 extends boolean, T6>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3, b4: B4, v4: T4, b5: B5, v5: T5, b6: B6, v6: T6): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : B4 extends true ? T4 : B5 extends true ? T5 : B6 extends true ? T6 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3, B4 extends boolean, T4, B5 extends boolean, T5, B6 extends boolean, T6, B7 extends boolean, T7>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3, b4: B4, v4: T4, b5: B5, v5: T5, b6: B6, v6: T6, b7: B7, v7: T7): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : B4 extends true ? T4 : B5 extends true ? T5 : B6 extends true ? T6 : B7 extends true ? T7 : void
export function elegir <B0 extends boolean, T0, B1 extends boolean, T1, B2 extends boolean, T2, B3 extends boolean, T3, B4 extends boolean, T4, B5 extends boolean, T5, B6 extends boolean, T6, B7 extends boolean, T7, B8 extends boolean, T8>(b0: B0, v0: T0, b1: B1, v1: T1, b2: B2, v2: T2, b3: B3, v3: T3, b4: B4, v4: T4, b5: B5, v5: T5, b6: B6, v6: T6, b7: B7, v7: T7, b8: B8, v8: T8): B0 extends true ? T0 : B1 extends true ? T1 : B2 extends true ? T2 : B3 extends true ? T3 : B4 extends true ? T4 : B5 extends true ? T5 : B6 extends true ? T6 : B7 extends true ? T7 : B8 extends true ? T8 : void

export function elegir(...args: any[]) {
  if (args.length >= 2) {
    if (args[0] === true) {
      return args[1]
    }

    return (elegir as any)(...args.slice(2))
  }
}
