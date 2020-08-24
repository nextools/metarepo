export const noop = () => {}
export const add = (arg0: number) => (arg1: number) => arg0 + arg1
export const addAsync = (arg0: number) => (arg1: number) => Promise.resolve(arg0 + arg1)
export const mult = (arg0: number) => (arg1: number) => arg0 * arg1
export const constant = <T>(arg: T) => () => arg
export const constantAsync = <T>(arg: T) => () => Promise.resolve(arg)
export const toString = (arg: number) => `${arg}`
export const toStringAsync = (arg: number) => Promise.resolve(`${arg}`)
export const throwing = (message: string) => () => {
  throw new Error(message)
}
export const throwingAsync = (message: string) => () => Promise.reject(new Error(message))
