import React from 'react'
import { component, startWithType } from 'refun'
import { ButtonIcon } from '../button-icon'
import { IconCloseSmall } from '../icons'
import { consoleClear } from '../../store-console'
import { Tooltip } from '../tooltip'
import { Layout, Layout_Item } from '../layout'

export type TClearConsoleButton = {}

export const ClearConsoleButton = component(
  startWithType<TClearConsoleButton>()
)(() => (
  <Layout hPadding={20} vPadding={20}>
    <Layout_Item hAlign="right">
      <ButtonIcon size={40} onPress={consoleClear}>
        <IconCloseSmall/>
        <Tooltip arrowPosition="top-right">
          Clear Console
        </Tooltip>
      </ButtonIcon>
    </Layout_Item>
  </Layout>
))
