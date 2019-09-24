import React, { FC } from 'react'
import { pureComponent, startWithType } from 'refun'
import { TAnyObject } from 'tsfn'

export type TPureComponent = {
  Component: FC<any>,
  props?: TAnyObject,
}

export const PureComponent = pureComponent(
  startWithType<TPureComponent>()
)(({ Component, props }) => (
  <Component {...props}/>
))
