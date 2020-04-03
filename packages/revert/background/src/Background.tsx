import React from 'react'
import { startWithType, component } from 'refun'
import { ParentBlock } from '@revert/block'
import { AnimationColor } from '@revert/animation'
import { PrimitiveBackground, TBackground } from './PrimitiveBackground'

export const Background = component(
  startWithType<TBackground>()
)((props) => (
  <ParentBlock>
    <AnimationColor toColor={props.color}>
      {(color) => (
        <PrimitiveBackground {...props} color={color}/>
      )}
    </AnimationColor>
  </ParentBlock>
))

Background.displayName = 'Background'
Background.componentSymbol = Symbol('REVERT_BACKGROUND')
