import { Text } from '@revert/text'
import type { TPrimitiveText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TScroll } from '../src'

export const TextConfig: TComponentConfig<TPrimitiveText> = {
  props: {
    children: ['text'],
  },
  required: ['children'],
}

export const config: TComponentConfig<TScroll> = {
  props: {
    shouldScrollHorizontally: [true],
    shouldScrollVertically: [true],
    shouldScrollToBottom: [true],
  },
  children: {
    text: {
      Component: Text,
      config: TextConfig,
    },
  },
}

export { Scroll as Component } from '../src'
