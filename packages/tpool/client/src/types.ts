export type TPipeThreadPoolOptions = {
  pools: string[],
  groupBy?: number,
  groupType?: 'serial' | 'concurrent',
}

export type TPromiseExecutor<T> = {
  resolve: (arg: T) => void,
  reject: (reason?: any) => void,
}
