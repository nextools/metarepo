import { Text } from '@revert/text'
import type { TText } from '@revert/text'
import type { TComponentConfig } from 'autoprops'
import type { TLayout, TLayout_Item } from '../src'
import { Layout_Item } from '../src'

const AlignItem_TextConfig: TComponentConfig<TText> = {
  props: {
    color: [0xeeaa88ff],
    fontSize: [16],
    fontWeight: [400],
    children: ['align'],
  },
}

const LayoutItemConfig: TComponentConfig<TLayout_Item, 'text'> = {
  props: {
    hAlign: ['left', 'center', 'right', 'stretch'],
    vAlign: ['top', 'center', 'bottom', 'stretch'],
    hPadding: [10],
    vPadding: [5],
  },
  children: {
    text: {
      Component: Text,
      config: AlignItem_TextConfig,
    },
  },
  required: ['text'],
}

export const config: TComponentConfig<TLayout> = {
  props: {
    direction: ['horizontal', 'vertical'],
  },
  required: ['direction'],
  children: {
    alignItem: {
      Component: Layout_Item,
      config: LayoutItemConfig,
    },
  },
}

export { Layout as Component } from '../src'
