/* eslint-disable no-use-before-define */
import { isDefined } from 'tsfn'
import { TComponentConfig } from 'autoprops'
import { textHeight } from '../text'
import { valueCheckboxHeight } from './ValueCheckbox'

export const SPACER_SIZE = 20
export const TEXT_SPACER_SIZE = 10
export const TITLE_HEIGHT = textHeight + SPACER_SIZE * 2
export const ROW_HEIGHT = valueCheckboxHeight + textHeight + TEXT_SPACER_SIZE + SPACER_SIZE

export const getRowWidth = (width: number) => width - SPACER_SIZE * 2
export const getColumnWidth = (width: number) => (width - SPACER_SIZE * 3) / 2

export const getPropsBlockHeight = (componentConfig: TComponentConfig): number => {
  const rowsCount = Math.ceil(Object.keys(componentConfig.props).length / 2)
  let childrenHeight = 0

  if (isDefined(componentConfig.children)) {
    childrenHeight = Object.keys(componentConfig.children).length * TITLE_HEIGHT
  }

  return rowsCount * ROW_HEIGHT + childrenHeight + SPACER_SIZE
}
