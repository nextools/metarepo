import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { AnimationColor } from '@revert/animation'
import { PrimitiveShadow } from './PrimitiveShadow'
import { TShadow } from './types'

export const Shadow = component(
  startWithType<TShadow>()
)((props) => (
  <ParentBlock>
    <AnimationColor toColor={props.color}>
      {(color) => (
        <PrimitiveShadow {...props} color={color}/>
      )}
    </AnimationColor>
  </ParentBlock>
))

Shadow.displayName = 'Shadow'
Shadow.componentSymbol = Symbol('REVERT_SHADOW')
