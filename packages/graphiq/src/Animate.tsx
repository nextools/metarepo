import { AnimationValue } from '@revert/animation'
import type { TAnimationValue } from '@revert/animation'
import { component, startWithType, mapState, mapHandlers, onUpdate, onChange, mapDefaultProps } from 'refun'

const STATE_CLOSED = 0
const STATE_OPENING = 1
const STATE_OPENED = 2
const STATE_CLOSING = 3

type TState = typeof STATE_CLOSED | typeof STATE_OPENING | typeof STATE_OPENED | typeof STATE_CLOSING

export type TAnimate = Pick<TAnimationValue, 'fromValue' | 'toValue' | 'time' | 'easing' | 'children'> & {
  isEnabled: boolean,
}

export const Animate = component(
  startWithType<TAnimate>(),
  mapDefaultProps({
    fromValue: 0,
  }),
  mapState('state', 'setState', ({ isEnabled }) => (isEnabled ? STATE_OPENED : STATE_CLOSED) as TState, []),
  mapHandlers({
    onAnimationEnd: ({ state, setState }) => () => {
      if (state === STATE_CLOSING) {
        setState(STATE_CLOSED)
      }
    },
  }),
  onChange(({ state, isEnabled, setState }) => {
    if (isEnabled) {
      if (state !== STATE_OPENED) {
        setState(STATE_OPENING)
      }
    } else if (state !== STATE_CLOSED) {
      setState(STATE_CLOSING)
    }
  }, ['isEnabled']),
  onUpdate(({ state, setState }) => {
    if (state === STATE_OPENING) {
      setState(STATE_OPENED)
    }
  }, ['state'])
)(({ state, fromValue, toValue, time, easing, children, onAnimationEnd }) => {
  if (state === STATE_CLOSED) {
    return null
  }

  return (
    <AnimationValue
      time={time}
      easing={easing}
      toValue={state === STATE_OPENED ? toValue : fromValue}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </AnimationValue>
  )
})
