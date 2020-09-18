export type TStringKey<T> = keyof T & string

export const iterateObjectKeys = <T extends {}>(obj: T): Iterable<TStringKey<T>> => ({
  *[Symbol.iterator]() {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        yield key
      }
    }
  },
})

export const iterateObjectValues = <T extends {}>(obj: T): Iterable<T[TStringKey<T>]> => ({
  *[Symbol.iterator]() {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        yield (obj as any)[key]
      }
    }
  },
})

export const iterateObjectEntries = <T extends {}>(obj: T): Iterable<[TStringKey<T>, T[TStringKey<T>]]> => ({
  *[Symbol.iterator]() {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        yield [key, (obj as any)[key]]
      }
    }
  },
})
