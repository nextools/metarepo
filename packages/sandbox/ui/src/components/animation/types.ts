export type TAnimationMapFn <T> = (from: T, to: T, time: number) => T

export type TEasingFn = (range: number, time: number) => number
