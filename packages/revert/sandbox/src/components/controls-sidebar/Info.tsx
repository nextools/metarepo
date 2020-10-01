import { Layout, Layout_Item } from '@revert/layout'
import { Link } from '@revert/link'
import { Scroll } from '@revert/scroll'
import { elegir } from 'elegir'
import React from 'react'
import { startWithType, mapContext, pureComponent } from 'refun'
import { isUndefined } from 'tsfn'
import { mapMetaStoreState } from '../../store-meta'
import { Text } from '../text'
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

  console.log(theme.linkColor)

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
        {(packageInfo.designDocsUrl || packageInfo.sourceCodeUrl) && (
          <Layout_Item>
            <Layout>
              <Layout_Item>
                <Text>Learn More</Text>
              </Layout_Item>
              <Layout_Item>

                <Layout spaceBetween={10} direction="vertical">
                  {packageInfo.designDocsUrl && (
                    <Layout_Item>
                      <Link target="_blank" href={packageInfo.designDocsUrl}>
                        <Text isUnderline color={theme.linkColor}>Design docs</Text>
                      </Link>
                    </Layout_Item>
                  )}
                  {packageInfo.sourceCodeUrl && (
                    <Layout_Item>
                      <Link target="_blank" href={packageInfo.sourceCodeUrl}>
                        <Text isUnderline color={theme.linkColor}>Codebase</Text>
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
