import { Layout, Layout_Item } from '@revert/layout'
import { Link } from '@revert/link'
import { Scroll } from '@revert/scroll'
import { startWithType, mapContext, pureComponent } from 'refun'
import { isString, isUndefined } from 'tsfn'
import { mapMetaStoreState } from '../../store-meta'
import { PrimitiveText, Text } from '../text'
import { ThemeContext } from '../theme-context'

export const Info = pureComponent(
  startWithType<{}>(),
  mapContext(ThemeContext),
  mapMetaStoreState(({ packageJson }) => {
    if (packageJson === null) {
      return {}
    }

    return ({
      packageInfo: {
        version: packageJson.version,
        stability: packageJson.version.startsWith('0')
          ? 'unstable' as const
          : 'stable' as const,
        platform: (
          Reflect.has(packageJson, 'browser') && Reflect.has(packageJson, 'react-native') ? 'Web & Native' :
          Reflect.has(packageJson, 'browser') ? 'Web' :
          Reflect.has(packageJson, 'react-native') ? 'Native' :
          'Node'
        ),
        designDocsUrl: packageJson.designDocsUrl,
        sourceCodeUrl: packageJson.sourceCodeUrl,
      },
    })
  }, ['packageJson'])
)(({
  packageInfo,
  theme,
}) => {
  if (isUndefined(packageInfo)) {
    return (
      <Layout direction="vertical">
        <Layout_Item hAlign="center" vAlign="center">
          <Text>No package info</Text>
        </Layout_Item>
      </Layout>
    )
  }

  return (
    <Scroll shouldScrollVertically>
      <Layout direction="vertical" hPadding={10} vPadding={10} spaceBetween={10}>
        <Layout_Item>
          <Text>Version {packageInfo.version}</Text>
        </Layout_Item>
        <Layout_Item>
          <Text>Stability {packageInfo.stability}</Text>
        </Layout_Item>
        <Layout_Item>
          <Text>Platform {packageInfo.platform}</Text>
        </Layout_Item>
        {(isString(packageInfo.designDocsUrl) || isString(packageInfo.sourceCodeUrl)) && (
          <Layout_Item>
            <Layout>
              <Layout_Item>
                <Text>Learn More</Text>
              </Layout_Item>
              <Layout_Item>

                <Layout spaceBetween={10} direction="vertical">
                  {isString(packageInfo.designDocsUrl) && (
                    <Layout_Item>
                      <Link target="_blank" href={packageInfo.designDocsUrl}>
                        <PrimitiveText isUnderline color={theme.linkColor}>Design docs</PrimitiveText>
                      </Link>
                    </Layout_Item>
                  )}
                  {isString(packageInfo.sourceCodeUrl) && (
                    <Layout_Item>
                      <Link target="_blank" href={packageInfo.sourceCodeUrl}>
                        <PrimitiveText isUnderline color={theme.linkColor}>Codebase</PrimitiveText>
                      </Link>
                    </Layout_Item>
                  )}
                </Layout>

              </Layout_Item>
            </Layout>
          </Layout_Item>
        )}
      </Layout>
    </Scroll>
  )
})

Info.displayName = 'Info'
Info.componentSymbol = Symbol('CONTROLS_SIDEBAR_INFO')
