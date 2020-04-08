import React from 'react'
import { component, startWithType } from 'refun'
import { ParentBlock } from '@revert/block'
import { AnimationColor } from '@revert/animation'
import { PrimitiveBorder } from './PrimitiveBorder'
import { TBorder } from './types'

export const Border = component(
  startWithType<TBorder>()
)((props) => (
  <ParentBlock>
    <AnimationColor toColor={props.color}>
      {(color) => (
        <PrimitiveBorder {...props} color={color}/>
      )}
    </AnimationColor>
  </ParentBlock>
))

Border.displayName = 'Border'
Border.componentSymbol = Symbol('REVERT_BORDER')
