import { pureComponent, startWithType } from 'refun'
import type { TComponentWrapper } from '../plugin-provider'

export const PureComponent = pureComponent(
  startWithType<TComponentWrapper>()
)(({ Component, props }) => (
  <Component {...props}/>
))

PureComponent.displayName = 'PureComponent'
