export type TWorkerResult = {
  path: string,
  id: string,
  data: Buffer,
}

export type TMessage = {
  type: 'DONE',
  value: TWorkerResult,
} | {
  type: 'ERROR',
  value: string,
}
