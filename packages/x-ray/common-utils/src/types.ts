export type TMessageStatus = 'ok' | 'diff' | 'new' | 'unknown'

export type TMessage = {
  status: TMessageStatus,
  path: string,
}

export type TCheckResult = {
  status: TMessageStatus,
  path: string,
}

export type TTotalResult = {
  ok: number,
  diff: number,
  new: number,
}
