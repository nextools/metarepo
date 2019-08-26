import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_NEW, DISCARD_ALPHA, BORDER_SIZE } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Screenshot } from './Screenshot'

export type TScreenshotNew = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
}

export const ScreenshotNew = pureComponent(
  startWithType<TScreenshotNew>()
)(({ top, left, width, height, id, isDiscarded }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      cursor: 'pointer',
    }}
  >
    <Block left={BORDER_SIZE} top={BORDER_SIZE}>
      <Screenshot
        id={id}
        type="new"
        width={width - BORDER_SIZE * 2}
        height={height - BORDER_SIZE * 2}
      />
    </Block>
    <Border
      topWidth={BORDER_SIZE}
      leftWidth={BORDER_SIZE}
      rightWidth={BORDER_SIZE}
      bottomWidth={BORDER_SIZE}
      color={COLOR_BORDER_NEW}
    />
  </Block>
))

ScreenshotNew.displayName = 'ScrenshotNew'
