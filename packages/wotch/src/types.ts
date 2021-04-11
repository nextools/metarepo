export type TCancelFn = () => void

export type TCancelToken = {
  onCancel: (cancelFn: TCancelFn) => void,
  symbol: Symbol,
}

export type TWatchEvent = {
  type: 'ADD_DIR' | 'REMOVE_DIR' | 'ADD_FILE' | 'CHANGE_FILE',
  path: string,
}
