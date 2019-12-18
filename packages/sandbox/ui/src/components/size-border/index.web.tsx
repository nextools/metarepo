import React from 'react'
import { component, startWithType } from 'refun'
import { PrimitiveBorder, TPrimitiveBorder } from '../primitive-border'
import { AnimationColor } from '../animation'
import { SizeParentBlock } from '../size-parent-block'

export const SizeBorder = component(
  startWithType<TPrimitiveBorder>()
)((props) => (
  <SizeParentBlock>
    <AnimationColor toColor={props.color}>
      {(color) => (
        <PrimitiveBorder {...props} color={color}/>
      )}
    </AnimationColor>
  </SizeParentBlock>
))

SizeBorder.displayName = 'Border'
SizeBorder.componentSymbol = Symbol('BORDER')
