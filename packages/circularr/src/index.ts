export default class Circularr <T> {
  private _data: T[]
  private _index: number

  static from<T>(source: T[]): Circularr<T> {
    const arr = new Circularr<T>(source.length)

    for (let i = 0; i < source.length; i++) {
      arr._data[i] = source[i]
    }

    return arr
  }

  constructor(length: number) {
    this._data = new Array<T>(length)
    this._index = 0
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[(i + this._index) % this._data.length]
    }
  }

  get length(): number {
    return this._data.length
  }

  fill(value: T): this {
    for (let i = 0; i < this._data.length; i++) {
      this._data[i] = value
    }

    this._index = 0

    return this
  }

  clear(): this {
    this._data = new Array<T>(this._data.length)
    this._index = 0

    return this
  }

  shift(value: T): T {
    const returnValue = this._data[this._index]

    this._data[this._index] = value
    this._index = (this._index + 1) % this._data.length

    return returnValue
  }

  unshift(value: T): T {
    this._index = (this._index + this._data.length - 1) % this._data.length

    const returnValue = this._data[this._index]

    this._data[this._index] = value

    return returnValue
  }

  slice(startIndex?: number, endIndex?: number): Circularr<T> {
    return Circularr.from(Array.from(this).slice(startIndex, endIndex))
  }

  trim(): Circularr<T> {
    const data = Array.from(this)
    let startIndex = 0
    let endIndex = data.length

    for (let i = 0; i < data.length; i++) {
      if (typeof data[i] !== 'undefined') {
        break
      }

      startIndex++
    }

    for (let i = data.length - 1; i >= 0; --i) {
      if (typeof data[i] !== 'undefined') {
        break
      }

      endIndex--
    }

    return Circularr.from(data.slice(startIndex, endIndex))
  }

  at(index: number): T | undefined {
    if (index < 0 || index >= this._data.length) {
      return
    }

    return this._data[(index + this._index) % this._data.length]
  }

  wrapAt(index: number): T | undefined {
    return this._data[(index + this._index) % this._data.length]
  }
}
