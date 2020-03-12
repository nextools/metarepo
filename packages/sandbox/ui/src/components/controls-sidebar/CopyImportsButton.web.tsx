import React from 'react'
import { startWithType, pureComponent, mapHandlers, mapContext } from 'refun'
import { isDefined } from 'tsfn'
import { Layout, Layout_Item } from '../layout'
import { IconCopySource } from '../icons'
import { ButtonIcon } from '../button-icon'
import { Tooltip } from '../tooltip'
import { ThemeContext } from '../theme-context'
import { NotificationContext } from '../notification-provider'
import { mapMetaStoreState } from '../../store-meta'
import { serializeImportsToText } from './serialize-imports-to-text'

export type TCopyImportsButton = {
  importPackageName: string,
}

export const CopyImportsButton = pureComponent(
  startWithType<TCopyImportsButton>(),
  mapContext(ThemeContext),
  mapContext(NotificationContext),
  mapMetaStoreState(({ Component, componentProps }) => ({
    Component,
    componentProps,
  }), ['Component', 'componentProps']),
  mapHandlers({
    onCopyImports: ({ Component, componentProps, importPackageName, sendNotification }) => async () => {
      if (isDefined(Component) && isDefined(componentProps)) {
        await navigator.clipboard.writeText(
          serializeImportsToText(Component, componentProps, importPackageName)
        )
        sendNotification('Copied to clipboard')
      }
    },
  })
)(({ onCopyImports }) => (
  <Layout hPadding={20} vPadding={20}>
    <Layout_Item hAlign="right">
      <ButtonIcon size={40} onPress={onCopyImports}>
        <IconCopySource/>
        <Tooltip arrowPosition="top-right">
          Copy Source
        </Tooltip>
      </ButtonIcon>
    </Layout_Item>
  </Layout>
))
