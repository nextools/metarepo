import { TComponents } from '@sandbox/ui'

export const components: TComponents = {
  Button: () => import(/* webpackChunkName: "Button" */ '@primitives/button/meta'),
  Input: () => import(/* webpackChunkName: "Input" */ '@primitives/input/meta'),
  Checkbox: () => import(/* webpackChunkName: "Checkbox" */ '@primitives/checkbox/meta'),
}

