import type { ReactNode } from 'react'

export type TScroll = {
  shouldScrollHorizontally?: boolean,
  shouldScrollVertically?: boolean,
  shouldScrollToBottom?: boolean,
  children: ReactNode,
}
