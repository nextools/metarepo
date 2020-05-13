import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { colorToString } from 'colorido'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, DISCARD_ALPHA, BORDER_SIZE, DASH_SPACE } from '../config'
import { Screenshot } from './Screenshot'
import { Block } from './Block'

export type TScreenshotDeleted = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
  hasNoBorder?: boolean,
}

export const ScreenshotDeleted = pureComponent(
  startWithType<TScreenshotDeleted>()
)(({ top, left, width, height, id, isDiscarded, hasNoBorder }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      background: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,#fff,#fff ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${DASH_SPACE}px)`,
    }}
  >
    <Block left={BORDER_SIZE} top={BORDER_SIZE}>
      <Screenshot
        id={id}
        type="ORIG"
        width={width - BORDER_SIZE * 2}
        height={height - BORDER_SIZE * 2}
      />
    </Block>
  </Block>
))

ScreenshotDeleted.displayName = 'ScreenshotDeleted'
