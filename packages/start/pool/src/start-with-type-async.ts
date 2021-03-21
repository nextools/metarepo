export const startWithTypeAsync = <T>() => (it: AsyncIterable<T>): AsyncIterable<T> => it
