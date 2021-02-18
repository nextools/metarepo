import {
  component,
  mapState,
  startWithType,
  onUpdate,
} from 'refun'
import { Container } from './Container'
import { getDimensions, subscribeDimensions } from './dimensions'
import type { TPrimitiveRoot } from './types'

export const PrimitiveRoot = component(
  startWithType<TPrimitiveRoot>(),
  mapState('dimensions', 'setDimensions', getDimensions, []),
  onUpdate(({ setDimensions }) => subscribeDimensions(setDimensions), [])
)(({ children, dimensions }) => (
  <Container dimensions={dimensions}>
    {children(dimensions)}
  </Container>
))

PrimitiveRoot.displayName = 'PrimitiveRoot'
