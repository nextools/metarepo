import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Link } from '@revert/link'
import { elegir } from 'elegir'
import React from 'react'
import { startWithType, mapContext, pureComponent } from 'refun'
import { isUndefined, isDefined } from 'tsfn'
import { mapContextOverride } from '../../map/map-context-override'
import { mapMetaStoreState } from '../../store-meta'
import { Text } from '../text'
import { ThemeContext, TextThemeContext } from '../theme-context'

export const Info = pureComponent(
  startWithType<{}>(),
  mapContext(ThemeContext),
  mapContextOverride('LinkThemeProvider', TextThemeContext, ({ theme }) => ({ color: theme.linkColor })),
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
        platform: elegir(
          Reflect.has(packageJson, 'browser') && Reflect.has(packageJson, 'react-native'),
          'Web & Native',
          Reflect.has(packageJson, 'browser'),
          'Web',
          Reflect.has(packageJson, 'react-native'),
          'Native',
          true,
          'Node'
        ),
        designDocsUrl: packageJson.designDocsUrl,
        sourceCodeUrl: packageJson.sourceCodeUrl,
      },
    })
  }, ['packageJson'])
)(({
  theme,
  packageInfo,
  LinkThemeProvider,
}) => {
  if (isUndefined(packageInfo)) {
    return null
  }

  return (
    <Layout direction="vertical" hPadding={10} vPadding={10} spaceBetween={10}>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <Text>
              Version
            </Text>
          </Layout_Item>
          <Layout_Item>
            <Text>
              {packageInfo.version}
            </Text>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <Text>
              Stability
            </Text>
          </Layout_Item>
          <Layout_Item>
            <Text>
              {packageInfo.stability}
            </Text>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <Text>
              Platform
            </Text>
          </Layout_Item>
          <Layout_Item>
            <Text>
              {packageInfo.platform}
            </Text>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      {(isDefined(packageInfo.designDocsUrl) || isDefined(packageInfo.sourceCodeUrl)) && (
        <Layout_Item height={LAYOUT_SIZE_FIT}>
          <Layout>
            <Layout_Item>
              <Text>
                Learn More
              </Text>
            </Layout_Item>
            <Layout_Item>
              <LinkThemeProvider>
                <Layout spaceBetween={10} direction="vertical">
                  {isDefined(packageInfo.designDocsUrl) && (
                    <Layout_Item height={LAYOUT_SIZE_FIT}>
                      <Link target="_blank" href={packageInfo.designDocsUrl} color={theme.linkColor} isUnderlined>
                        Design docs
                      </Link>
                    </Layout_Item>
                  )}
                  {isDefined(packageInfo.sourceCodeUrl) && (
                    <Layout_Item height={LAYOUT_SIZE_FIT}>
                      <Link target="_blank" href={packageInfo.sourceCodeUrl} color={theme.linkColor} isUnderlined>
                        Codebase
                      </Link>
                    </Layout_Item>
                  )}
                </Layout>
              </LinkThemeProvider>
            </Layout_Item>
          </Layout>
        </Layout_Item>
      )}
    </Layout>
  )
})

Info.displayName = 'Info'
Info.componentSymbol = Symbol('CONTROLS_SIDEBAR_INFO')
