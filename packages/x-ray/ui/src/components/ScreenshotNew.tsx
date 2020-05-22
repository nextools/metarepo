import React from 'react'
import { startWithType, pureComponent, mapContext, mapWithPropsMemo } from 'refun'
import { TOmitKey } from 'tsfn'
import { colorToString } from 'colorido'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { DISCARD_ALPHA, BORDER_SIZE, COLOR_WHITE, COLOR_DM_BLACK, COLOR_BORDER_NEW, DASH_SPACE } from '../config'
import { ThemeContext } from '../context/Theme'
import { Screenshot } from './Screenshot'
import { Block } from './Block'

export type TScreenshotNew = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
  hasNoBorder?: boolean,
}

export const ScreenshotNew = pureComponent(
  startWithType<TScreenshotNew>(),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      border: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
    },
  }), ['darkMode'])
)(({ color, top, left, width, height, id, isDiscarded, hasNoBorder }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      _webOnly: {
        cursor: 'pointer',
        backgroundImage: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${DASH_SPACE}px)`,
      },
    }}
  >
    <Block
      left={BORDER_SIZE}
      top={BORDER_SIZE}
    >
      <Screenshot
        id={id}
        type="NEW"
        width={width - BORDER_SIZE * 2}
        height={height - BORDER_SIZE * 2}
      />
    </Block>
  </Block>
))

ScreenshotNew.displayName = 'ScrenshotNew'
