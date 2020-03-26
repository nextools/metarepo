import React from 'react'
import { mapPropsIterable } from 'autoprops'
import { TMeta } from '@x-ray/screenshot-utils'
import { serializeElement } from '@x-ray/common-utils'
import { Button } from '../src'
import { Component, config } from '../meta'

export default mapPropsIterable(config, ({ id, props }): TMeta => {
  console.log(id)

  return ({
    id,
    serializedElement: serializeElement(Component, props),
    options: {
      hasOwnWidth: true,
      maxWidth: 600,
    },
    element: (<Button {...props}/>),
  })
})
