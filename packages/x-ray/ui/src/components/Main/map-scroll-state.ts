import { pipe } from 'funcom'
import { mapState, mapHandlers, mapThrottledHandlerAnimationFrame, mapDebouncedHandlerTimeout, startWithType } from 'refun'

export const mapScrollState = <P extends {}>() => pipe(
  startWithType<P>(),
  mapState('scrollTop', 'setScrollTop', () => 0, []),
  mapState('prevScrollTop', 'setPrevScrollTop', () => null as number | null, []),
  mapHandlers(({
    onScrollScrolling: ({ scrollTop, setScrollTop, setPrevScrollTop, prevScrollTop }) => (newScrollTop) => {
      setScrollTop(newScrollTop)

      // is scrolling just started, store previous scroll pos
      if (prevScrollTop === null) {
        setPrevScrollTop(scrollTop)
      }
    },
    onScrollStop: ({ setPrevScrollTop }) => () => {
      setPrevScrollTop(null)
    },
  })),
  mapThrottledHandlerAnimationFrame('onScrollScrolling'),
  mapDebouncedHandlerTimeout('onScrollStop', 100),
  mapHandlers({
    onScroll: ({ onScrollScrolling, onScrollStop }) => (scrollTop) => {
      onScrollScrolling(scrollTop)
      onScrollStop()
    },
  })
)
