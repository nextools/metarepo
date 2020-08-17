import type { ReactText } from 'react'

export type TText = {
  shouldPreventWrap?: boolean,
  shouldHideOverflow?: boolean,
  shouldPreventSelection?: boolean,
  isUnderlined?: boolean,
  children: ReactText,
}
