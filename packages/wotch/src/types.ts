export type TCancelFn = () => void

export type TCancelToken = {
  onCancel: (cancelFn: TCancelFn) => void,
  symbol: Symbol,
}

export type TWatchEvent = {
  type: 'ADD_FILE' | 'ADD_DIR' | 'CHANGE_FILE' | 'REMOVE_FILE' | 'REMOVE_DIR',
  path: string,
}
