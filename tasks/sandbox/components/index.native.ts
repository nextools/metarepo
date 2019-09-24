import { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
}
