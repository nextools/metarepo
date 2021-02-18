import { Layout, Layout_Item } from '@revert/layout'
import { startWithType, pureComponent, mapHandlers, mapContext } from 'refun'
import { mapMetaStoreState } from '../../store-meta'
import { ButtonIcon } from '../button-icon'
import { IconCopySource } from '../icons'
import { NotificationContext } from '../notification-provider'
import { ThemeContext } from '../theme-context'
import { Tooltip } from '../tooltip'
import { serializeImportsToText } from './serialize-imports-to-text'

export type TCopyImportsButton = {
  getImportPackageName: (symbolName: string) => string,
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
    onCopyImports: ({ Component, componentProps, getImportPackageName, sendNotification }) => async () => {
      if (Component !== null) {
        await navigator.clipboard.writeText(
          serializeImportsToText(Component, componentProps, getImportPackageName)
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
