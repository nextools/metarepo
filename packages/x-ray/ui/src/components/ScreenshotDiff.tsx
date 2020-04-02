import React, { Fragment } from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { PrimitiveBorder as Border } from '@revert/border'
import { PrimitiveBlock as Block } from '@revert/block'
import { TPosition } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, COLOR_BORDER_NEW, DISCARD_ALPHA, BORDER_SIZE } from '../config'
import { Screenshot } from './Screenshot'

export type TScreenshotDiff = TPosition & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
  oldAlpha: number,
  newAlpha: number,
  isDiscarded: boolean,
}

export const ScreenshotDiff = pureComponent(
  startWithType<TScreenshotDiff>()
)(({
  left,
  top,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
  oldAlpha,
  newAlpha,
  id,
  isDiscarded,
}) => (
  <Fragment>
    <Block
      top={top}
      left={left}
      width={oldWidth}
      height={oldHeight}
      opacity={Math.min(oldAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
    >
      <Block left={BORDER_SIZE} top={BORDER_SIZE}>
        <Screenshot
          id={id}
          type="ORIG"
          width={oldWidth - BORDER_SIZE * 2}
          height={oldHeight - BORDER_SIZE * 2}
        />
      </Block>
      <Border
        width={BORDER_SIZE}
        color={COLOR_BORDER_DELETED}
      />
    </Block>
    <Block
      top={top}
      left={left}
      width={newWidth}
      height={newHeight}
      opacity={Math.min(newAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
    >
      <Block left={BORDER_SIZE} top={BORDER_SIZE}>
        <Screenshot
          id={id}
          type="NEW"
          width={newWidth - BORDER_SIZE * 2}
          height={newHeight - BORDER_SIZE * 2}
        />
      </Block>
      <Border
        width={BORDER_SIZE}
        color={COLOR_BORDER_NEW}
      />
    </Block>
  </Fragment>
))

ScreenshotDiff.displayName = 'ScreenshotDiff'
