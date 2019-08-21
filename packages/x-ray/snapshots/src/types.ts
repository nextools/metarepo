import { ReactElement } from 'react'
import { TLineElement } from 'syntx'
import { TItem } from '@x-ray/common-utils'

export type TMeta = {
  id: string,
  serializedElement: TLineElement[][],
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
  (TSnapshotsCheckResult & {
    id: string,
    serializedElement: TLineElement[][],
  }) |
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
    id: string,
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
