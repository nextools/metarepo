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
import { serializeComponentToText } from './serialize-component-to-text'

export type TCopySourceButton = {}

export const CopySourceButton = pureComponent(
  startWithType<TCopySourceButton>(),
  mapContext(ThemeContext),
  mapContext(NotificationContext),
  mapMetaStoreState(({ Component, componentProps }) => ({
    Component,
    componentProps,
  }), ['Component', 'componentProps']),
  mapHandlers({
    onCopySource: ({ Component, componentProps, sendNotification }) => () => {
      if (isDefined(Component) && isDefined(componentProps)) {
        navigator.clipboard.writeText(
          serializeComponentToText(Component, componentProps)
        )
        sendNotification('Copied to clipboard')
      }
    },
  })
)(({ onCopySource }) => (
  <Layout hPadding={20} vPadding={20}>
    <Layout_Item hAlign="right">
      <ButtonIcon size={40} onPress={onCopySource}>
        <IconCopySource/>
        <Tooltip arrowPosition="top-right">
          Copy Source
        </Tooltip>
      </ButtonIcon>
    </Layout_Item>
  </Layout>
))
