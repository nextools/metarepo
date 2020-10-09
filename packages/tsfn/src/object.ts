export const getObjectKeys = <T extends {}> (obj: T) => Object.keys(obj) as (keyof T)[]
export const getObjectValues = <T extends {}> (obj: T): T[keyof T][] => Object.values(obj)
export const getObjectEntries = <T extends {}> (obj: T) => Object.entries(obj) as unknown as [keyof T, T[keyof T]][]
export const objectHas = <T extends {}, K extends keyof T> (obj: T, key: K): obj is T & { [k in K]-?: T[k] } => Reflect.has(obj, key)
