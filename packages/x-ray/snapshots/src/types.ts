import { ReactElement } from 'react'
import { TItem, TSyntxLines } from '@x-ray/common-utils'

export type TMeta = {
  id: string,
  serializedElement: TSyntxLines,
  element: ReactElement<any>,
}

export type TSnapshotsCheckResult =
  {
    type: 'OK',
  } |
  {
    type: 'DIFF',
    oldData: Buffer,
    newData: Buffer,
  } |
  {
    type: 'NEW',
    data: Buffer,
  } |
  {
    type: 'DELETED',
    data: Buffer,
  }

export type TSnapshotsItemResult =
  {
    type: 'OK',
    id: string,
  } |
  {
    type: 'DIFF',
    oldData: Buffer,
    newData: Buffer,
    id: string,
    serializedElement: TSyntxLines,
  } |
  {
    type: 'NEW',
    data: Buffer,
    id: string,
    serializedElement: TSyntxLines,
  } |
  {
    type: 'DELETED',
    data: Buffer,
    id: string,
    serializedElement: TSyntxLines,
  } |
  {
    type: 'DONE',
    path: string,
  } |
  {
    type: 'ERROR',
    data: string,
  } |
  {
    type: 'BAILOUT',
    reason: 'NEW' | 'DIFF',
    id: string,
    path: string,
  } |
  {
    type: 'INIT',
  }

export type TSnapshotItem = TItem & {
  type: 'new' | 'deleted' | 'diff',
}

export type TSnapshotResultType = 'new' | 'diff' | 'deleted'

export type TSnapshotsFileResult = {
  [type in TSnapshotResultType]: {
    [id: string]: TItem,
  }
}

export type TSnapshotsResult = {
  [filename: string]: TSnapshotsFileResult,
}

export type TSnapshotsSave = string[]

export type TFileResultLine = {
  value: string,
  type?: 'added' | 'removed',
}

export type TSnapshotsFileResultData = {
  [k in TSnapshotResultType]: {
    [key: string]: TFileResultLine[],
  }
}

export type TSnapshotsResultData = { [key: string]: TSnapshotsFileResultData }

export type TRunSnapshotsResult = {
  result: TSnapshotsResult,
  resultData: TSnapshotsResultData,
  hasBeenChanged: boolean,
}

export type TSnapshotItems = {
  [id: string]: TSnapshotItem,
}

export type TSnapshotsListResult = {
  type: 'text',
  files: string[],
  items: TSnapshotItems,
}
