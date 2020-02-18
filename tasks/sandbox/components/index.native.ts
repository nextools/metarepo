import { TComponents } from '@sandbox/ui'
/* eslint-disable import/no-extraneous-dependencies */
import * as Button from '@primitives/button/meta'
import * as Input from '@primitives/input/meta'
import * as Checkbox from '@primitives/checkbox/meta'

export const components: TComponents = {
  Button: () => Promise.resolve(Button),
  Input: () => Promise.resolve(Input),
  Checkbox: () => Promise.resolve(Checkbox),
}
