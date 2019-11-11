import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/snapshots'
import { serializeElement } from '@x-ray/common-utils'
import { Input } from '../src'
import { Component, config } from '../meta'

export default mapPropsIterable(config, ({ id, props }): TMeta => ({
  id,
  serializedElement: serializeElement(Component, props),
  element: <Input {...props}/>,
}))
