import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import(/* webpackChunkName: "Button" */ '@primitives/button/meta'),
}

