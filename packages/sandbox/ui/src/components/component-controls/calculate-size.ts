/* eslint-disable no-use-before-define */
import { isUndefined } from 'tsfn'
import { TMetaFile } from 'autoprops'
import { textHeight } from '../text'
import { valueCheckboxHeight } from './ValueCheckbox'

export const SPACER_SIZE = 20
export const TEXT_SPACER_SIZE = 10
export const TITLE_HEIGHT = textHeight + SPACER_SIZE * 2
export const ROW_HEIGHT = valueCheckboxHeight + textHeight + TEXT_SPACER_SIZE + SPACER_SIZE

export const getRowWidth = (width: number) => width - SPACER_SIZE * 2
export const getColumnWidth = (width: number) => (width - SPACER_SIZE * 3) / 2

export const getPropsBlockHeight = (componentMetaFile: TMetaFile): number => {
  const rowsCount = Math.ceil(Object.keys(componentMetaFile.config.props).length / 2)
  let childrenHeight = 0

  if (!isUndefined(componentMetaFile.childrenConfig)) {
    childrenHeight = getChildrenBlockHeightTotal(componentMetaFile)
  }

  return rowsCount * ROW_HEIGHT + TITLE_HEIGHT + childrenHeight
}

export const getChildrenBlockHeightTotal = (componentMetaFile: TMetaFile) => {
  const childrenConfig = componentMetaFile.childrenConfig

  if (isUndefined(childrenConfig)) {
    return 0
  }

  return childrenConfig.children.length * TITLE_HEIGHT
}
