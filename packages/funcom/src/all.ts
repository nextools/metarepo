export function all<R0>(fn: () => R0): () => [R0]
export function all<ARG, R0>(fn: (arg: ARG) => R0): (arg: ARG) => [R0]

export function all<R0, R1>(fn0: () => R0, fn1: () => R1): () => [R0, R1]
export function all<ARG, R0, R1>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1): (arg: ARG) => [R0, R1]

export function all<R0, R1, R2>(fn0: () => R0, fn1: () => R1, fn2: () => R2): () => [R0, R1, R2]
export function all<ARG, R0, R1, R2>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2): (arg: ARG) => [R0, R1, R2]

export function all<R0, R1, R2, R3>(fn0: () => R0, fn1: () => R1, fn2: () => R2, fn3: () => R3): () => [R0, R1, R2, R3]
export function all<ARG, R0, R1, R2, R3>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2, fn3: (arg: ARG) => R3): (arg: ARG) => [R0, R1, R2, R3]

export function all<R0, R1, R2, R3, R4>(fn0: () => R0, fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4): () => [R0, R1, R2, R3, R4]
export function all<ARG, R0, R1, R2, R3, R4>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2, fn3: (arg: ARG) => R3, fn4: (arg: ARG) => R4): (arg: ARG) => [R0, R1, R2, R3, R4]

export function all<R0, R1, R2, R3, R4, R5>(fn0: () => R0, fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4, fn5: () => R5): () => [R0, R1, R2, R3, R4, R5]
export function all<ARG, R0, R1, R2, R3, R4, R5>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2, fn3: (arg: ARG) => R3, fn4: (arg: ARG) => R4, fn5: (arg: ARG) => R5): (arg: ARG) => [R0, R1, R2, R3, R4, R5]

export function all<R0, R1, R2, R3, R4, R5, R6>(fn0: () => R0, fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4, fn5: () => R5, fn6: () => R6): () => [R0, R1, R2, R3, R4, R5, R6]
export function all<ARG, R0, R1, R2, R3, R4, R5, R6>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2, fn3: (arg: ARG) => R3, fn4: (arg: ARG) => R4, fn5: (arg: ARG) => R5, fn6: (arg: ARG) => R6): (arg: ARG) => [R0, R1, R2, R3, R4, R5, R6]

export function all<R0, R1, R2, R3, R4, R5, R6, R7>(fn0: () => R0, fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4, fn5: () => R5, fn6: () => R6, fn7: () => R7): () => [R0, R1, R2, R3, R4, R5, R6, R7]
export function all<ARG, R0, R1, R2, R3, R4, R5, R6, R7>(fn0: (arg: ARG) => R0, fn1: (arg: ARG) => R1, fn2: (arg: ARG) => R2, fn3: (arg: ARG) => R3, fn4: (arg: ARG) => R4, fn5: (arg: ARG) => R5, fn6: (arg: ARG) => R6, fn7: (arg: ARG) => R7): (arg: ARG) => [R0, R1, R2, R3, R4, R5, R6, R7]

export function all (): () => []

export function all(...fns: any[]) {
  return (value: any) => fns.map((fn) => fn(value))
}

