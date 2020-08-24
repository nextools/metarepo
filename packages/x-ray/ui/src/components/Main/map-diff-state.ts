import { pipe } from 'funcom'
import { startWithType, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange } from 'refun'
import { DIFF_TIMEOUT } from '../../config'
import type { TScreenshotGridItem } from '../../types'
import { hasDiffItems } from './has-diff-items'

export type TMapDiffState = {
  height: number,
  scrollTop: number,
  prevScrollTop: number | null,
  shouldAnimate: boolean,
  cols: TScreenshotGridItem[][],
}

export const mapDiffState = <P extends TMapDiffState>() => pipe(
  startWithType<P & TMapDiffState>(),
  mapState('diffState', 'setDiffState', () => false, []),
  mapHandlers({
    toggleDiffState: ({ setDiffState, diffState }) => () => {
      setDiffState(!diffState)
    },
  }),
  mapSafeTimeout('setSafeTimeout'),
  mapRef('clearDiffTimeout', null as (() => void) | null),
  onChange(({ prevScrollTop, toggleDiffState, clearDiffTimeout, setSafeTimeout, shouldAnimate, cols, scrollTop, height }) => {
    if (clearDiffTimeout.current !== null) {
      clearDiffTimeout.current()
      clearDiffTimeout.current = null
    }

    if (prevScrollTop === null && shouldAnimate && hasDiffItems(cols, scrollTop, height)) {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['prevScrollTop', 'diffState', 'shouldAnimate'])
)
