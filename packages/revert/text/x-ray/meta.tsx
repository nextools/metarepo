import type { TComponentConfig } from 'autoprops'
import type { TPrimitiveText } from '../src'

export const config: TComponentConfig<TPrimitiveText> = {
  props: {
    color: [0xeeeeeeff],
    fontFamily: ['Arial'],
    fontSize: [16],
    fontWeight: [400],
    letterSpacing: [1],
    lineHeight: [20],
    isUnderline: [true],
    shouldHideOverflow: [true],
    shouldPreserveWhitespace: [true],
    shouldPreventSelection: [true],
    shouldPreventWrap: [true],
    children: ['text content'],
  },
  required: ['children'],
  deps: {
    fontFamily: ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'],
    fontSize: ['fontFamily', 'fontWeight', 'lineHeight', 'letterSpacing'],
    fontWeight: ['fontSize', 'fontFamily', 'lineHeight', 'letterSpacing'],
    lineHeight: ['fontSize', 'fontFamily', 'fontWeight', 'letterSpacing'],
    letterSpacing: ['fontSize', 'fontFamily', 'fontWeight', 'lineHeight'],
    shouldHideOverflow: ['shouldPreventWrap'],
    shouldPreventWrap: ['shouldHideOverflow'],
  },
}

export { PrimitiveText as Component } from '../src'
