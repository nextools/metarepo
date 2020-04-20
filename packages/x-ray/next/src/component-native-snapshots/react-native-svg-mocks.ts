import { createElement } from 'react'

export const ReactNativeSvgMocks = new Proxy({}, {
  get: (_, importedName: string) => {
    return (props: any) => createElement(importedName, props)
  },
})
