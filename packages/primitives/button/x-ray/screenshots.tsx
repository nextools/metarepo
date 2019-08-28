import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { serializeElement } from '@x-ray/common-utils'
import { Button } from '../src'
import * as metaFile from '../meta'

export default mapPropsIterable(metaFile, ({ id, props }): TMeta => ({
  id,
  serializedElement: serializeElement(metaFile.Component, props),
  options: {
    hasOwnWidth: true,
    maxWidth: 600,
  },
  element: (
    <Button {...props}/>
  ),
}))
