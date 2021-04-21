import { Layout, Layout_Item } from '@revert/layout'
import { startWithType, pureComponent, mapHandlers, mapContext } from 'refun'
import { mapMetaStoreState } from '../../store-meta'
import { ButtonIcon } from '../button-icon'
import { IconCopySource } from '../icons'
import { NotificationContext } from '../notification-provider'
import { ThemeContext } from '../theme-context'
import { Tooltip } from '../tooltip'
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
    onCopySource: ({ Component, componentProps, sendNotification }) => async () => {
      if (Component !== null) {
        await navigator.clipboard.writeText(
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
