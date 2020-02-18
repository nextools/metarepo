import React from 'react'
import { startWithType, mapContext, pureComponent } from 'refun'
import { isUndefined, isDefined } from 'tsfn'
import { elegir } from 'elegir'
import { Layout, Layout_Item } from '../layout'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { SizeText } from '../size-text'
import { SizeLink } from '../size-link'
import { ThemeContext, TextThemeContext } from '../theme-context'
import { mapContextOverride } from '../../map/map-context-override'
import { mapMetaStoreState } from '../../store-meta'

export const Info = pureComponent(
  startWithType<{}>(),
  mapContext(ThemeContext),
  mapContextOverride('LinkThemeProvider', TextThemeContext, ({ theme }) => ({ color: theme.linkColor })),
  mapMetaStoreState(({ packageJson }) => {
    if (isUndefined(packageJson)) {
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
            <SizeText>
              Version
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.version}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Stability
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.stability}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout>
          <Layout_Item>
            <SizeText>
              Platform
            </SizeText>
          </Layout_Item>
          <Layout_Item>
            <SizeText>
              {packageInfo.platform}
            </SizeText>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      {(isDefined(packageInfo.designDocsUrl) || isDefined(packageInfo.sourceCodeUrl)) && (
        <Layout_Item height={LAYOUT_SIZE_FIT}>
          <Layout>
            <Layout_Item>
              <SizeText>
                Learn More
              </SizeText>
            </Layout_Item>
            <Layout_Item>
              <LinkThemeProvider>
                <Layout spaceBetween={10} direction="vertical">
                  {isDefined(packageInfo.designDocsUrl) && (
                    <Layout_Item height={LAYOUT_SIZE_FIT}>
                      <SizeLink target="_blank" href={packageInfo.designDocsUrl} color={theme.linkColor} isUnderlined>
                        Design docs
                      </SizeLink>
                    </Layout_Item>
                  )}
                  {isDefined(packageInfo.sourceCodeUrl) && (
                    <Layout_Item height={LAYOUT_SIZE_FIT}>
                      <SizeLink target="_blank" href={packageInfo.sourceCodeUrl} color={theme.linkColor} isUnderlined>
                        Codebase
                      </SizeLink>
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
