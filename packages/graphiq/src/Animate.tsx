import React from 'react'
import { component, startWithType, mapState, mapHandlers, onUpdate, onChange } from 'refun'
import { Animation } from '@primitives/animation'
import { TAnimate } from './types'

const STATE_CLOSED = 0
const STATE_OPENING = 1
const STATE_OPENED = 2
const STATE_CLOSING = 3

type TState = typeof STATE_CLOSED | typeof STATE_OPENING | typeof STATE_OPENED | typeof STATE_CLOSING

export const Animate = component(
  startWithType<TAnimate>(),
  mapState('state', 'setState', ({ isActive }) => (isActive ? STATE_OPENED : STATE_CLOSED) as TState, []),
  mapHandlers({
    onAnimationEnd: ({ state, setState }) => () => {
      if (state === STATE_CLOSING) {
        setState(STATE_CLOSED)
      }
    },
  }),
  onChange(({ state, isActive, setState }) => {
    if (state !== STATE_OPENED && isActive) {
      setState(STATE_OPENING)
    }

    if (state !== STATE_CLOSED && !isActive) {
      setState(STATE_CLOSING)
    }
  }, ['isActive']),
  onUpdate(({ state, setState }) => {
    if (state === STATE_OPENING) {
      setState(STATE_OPENED)
    }
  }, ['state'])
)(({ state, from, to, time, easing, children, onAnimationEnd }) => {
  if (state === STATE_CLOSED) {
    return null
  }

  return (
    <Animation
      time={time}
      easing={easing}
      values={[state === STATE_OPENED ? to : from]}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </Animation>
  )
})
