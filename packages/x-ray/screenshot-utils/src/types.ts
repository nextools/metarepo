import { ReactElement } from 'react' // eslint-disable-line
import { TItem, TSyntxLines } from '@x-ray/common-utils'

export type TMeta = {
  id: string,
  serializedElement: TSyntxLines,
  element: ReactElement<any>,
  options: {
    hasOwnWidth?: boolean,
    overflow?: number,
    overflowTop?: number,
    overflowBottom?: number,
    overflowLeft?: number,
    overflowRight?: number,
    backgroundColor?: string,
    maxWidth?: number,
    shouldWaitForResize?: boolean,
    shouldWaitForImages?: boolean,
  },
}

export type TScreenshotsCheckResult =
  {
    type: 'OK',
  } |
  {
    type: 'DIFF',
    old: {
      data: Buffer,
      width: number,
      height: number,
    },
    new: {
      data: Buffer,
      width: number,
      height: number,
    },
  } |
  {
    type: 'NEW',
    data: Buffer,
    width: number,
    height: number,
  } |
  {
    type: 'DELETED',
    data: Buffer,
    width: number,
    height: number,
  }

export type TScreenshotItem = TItem & ({
  type: 'new' | 'deleted',
} | {
  type: 'diff',
  newWidth: number,
  newHeight: number,
})

export type TScreenshotResultType = 'old' | 'new'

export type TScreenshotsFileResult = {
  [k in TScreenshotResultType]: {
    [k: string]: TItem,
  }
}

export type TScreenshotsResult = {
  [filename: string]: TScreenshotsFileResult,
}

export type TScreenshotsSave = string[]

export type TScreenshotsItemResult =
  {
    type: 'OK',
    id: string,
  } |
  {
    type: 'DIFF',
    old: {
      data: Buffer,
      width: number,
      height: number,
    },
    new: {
      data: Buffer,
      width: number,
      height: number,
    },
    id: string,
    serializedElement: TSyntxLines,
  } |
  {
    type: 'NEW',
    data: Buffer,
    width: number,
    height: number,
    id: string,
    serializedElement: TSyntxLines,
  } |
  {
    type: 'DELETED',
    data: Buffer,
    width: number,
    height: number,
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
  } | {
    type: 'INIT',
  }

export type TScreenshotsFileResultData = {
  [k in TScreenshotResultType]: {
    [key: string]: Buffer,
  }
}

export type TScreenshotsResultData = {
  [key: string]: TScreenshotsFileResultData,
}

export type TRunScreesnotsResult = {
  result: TScreenshotsResult,
  resultData: TScreenshotsResultData,
  hasBeenChanged: boolean,
}

export type TScreenshotItems = {
  [id: string]: TScreenshotItem,
}

export type TScreenshotsListResult = {
  type: 'image',
  files: string[],
  items: TScreenshotItems,
}
