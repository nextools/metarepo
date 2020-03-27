import React from 'react'
import { startWithType, component } from 'refun'
import { TStyle } from 'stili'
import { ParentBlock } from '@revert/block'

const style: TStyle = {
  display: 'block',
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  userSelect: 'none',
}

export type TLabel = {}

export const Label = component(
  startWithType<TLabel>()
)(({ children }) => (
  <ParentBlock>
    <label style={style}>
      {children}
    </label>
  </ParentBlock>
))

Label.displayName = 'Label'
Label.componentSymbol = Symbol('REVERT_LABEL')
