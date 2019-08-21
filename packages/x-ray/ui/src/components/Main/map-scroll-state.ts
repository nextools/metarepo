import { pipe } from '@psxcode/compose'
import { mapState, mapHandlers, mapThrottledHandlerAnimationFrame, mapDebouncedHandlerTimeout, startWithType } from 'refun'

export const mapScrollState = <P extends {}>() => pipe(
  startWithType<P>(),
  mapState('scrollTop', 'setScrollTop', () => 0, []),
  mapState('prevScrollTop', 'setPrevScrollTop', () => null as number | null, []),
  mapHandlers(({
    onScroll1: ({ setScrollTop, setPrevScrollTop, prevScrollTop }) => (scrollTop) => {
      setScrollTop(scrollTop)

      if (prevScrollTop === null) {
        setPrevScrollTop(scrollTop)
      }
    },
    onScroll2: ({ setPrevScrollTop }) => () => {
      setPrevScrollTop(null)
    },
  })),
  mapThrottledHandlerAnimationFrame('onScroll1'),
  mapDebouncedHandlerTimeout('onScroll2', 100),
  mapHandlers({
    onScroll: ({ onScroll1, onScroll2 }) => (scrollTop) => {
      onScroll1(scrollTop)
      onScroll2()
    },
  })
)
