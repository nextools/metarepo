import { pipe } from '@psxcode/compose'
import { startWithType, mapState, mapSafeTimeout, mapHandlers, mapRef, onChange, onMount } from 'refun'
import { TScreenshotGridItem } from '../../types'
import { DIFF_TIMEOUT } from '../../config'
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
  mapSafeTimeout('setSafeTimeout'),
  mapHandlers({
    toggleDiffState: ({ setDiffState, diffState }) => () => {
      setDiffState(!diffState)
    },
  }),
  mapRef('clearDiffTimeout', null as any),
  onChange(({ prevScrollTop, toggleDiffState, clearDiffTimeout, setSafeTimeout, shouldAnimate, cols, scrollTop, height }) => {
    if (clearDiffTimeout.current !== null) {
      clearDiffTimeout.current()
      clearDiffTimeout.current = null
    }

    if (prevScrollTop === null && shouldAnimate && hasDiffItems(cols, scrollTop, height)) {
      clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
    }
  }, ['prevScrollTop', 'diffState', 'shouldAnimate']),
  onMount(({ clearDiffTimeout, toggleDiffState, setSafeTimeout }) => {
    clearDiffTimeout.current = setSafeTimeout(toggleDiffState, DIFF_TIMEOUT)
  })
)
