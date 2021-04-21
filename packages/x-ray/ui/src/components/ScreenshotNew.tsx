import { colorToString } from '@revert/color'
import { startWithType, pureComponent, mapContext, mapWithPropsMemo } from 'refun'
import type { TOmitKey } from 'tsfn'
import type { TApiLoadScreenshotOpts } from '../api'
import { DISCARD_ALPHA, BORDER_SIZE, COLOR_WHITE, COLOR_DM_BLACK, COLOR_BORDER_NEW, DASH_SPACE } from '../config'
import { ThemeContext } from '../context/Theme'
import type { TRect } from '../types'
import { Block } from './Block'
import { Screenshot } from './Screenshot'

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
)(({ color, top, left, width, height, id, isDiscarded, hasNoBorder = false }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      cursor: 'pointer',
      backgroundImage: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${DASH_SPACE}px)`,
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
