import React, { Fragment, FC } from 'react'
import { startWithType, component } from 'refun'
import { Button as RevertButton } from '@revert/button'
import { Background } from '@revert/background'
import { Text } from '@revert/text'
import { Layout, Layout_Item, Layout_Spacer } from '@revert/layout'
import { COLOR_GREEN } from '../config'

export type TSaveButton = {
  onPress: () => void,
}

const Button: FC<TSaveButton> = ({ onPress }) => (
  <Fragment>
    <Background color={COLOR_GREEN}/>
    <RevertButton onPress={onPress}>
      <Layout
        hPadding={10}
        vPadding={5}
      >
        <Layout_Item>
          <Text
            lineHeight={18}
            fontSize={16}
            fontFamily="sans-serif"
          >
            Save
          </Text>
        </Layout_Item>
      </Layout>

    </RevertButton>
  </Fragment>
)

export const SaveButton = component(
  startWithType<TSaveButton>()
)(({ onPress }) => (
  <Layout hPadding={10} vPadding={10}>
    <Layout_Spacer/>
    <Layout_Item width={100}>
      <Layout direction="vertical">
        <Layout_Spacer/>
        <Layout_Item height={26} hAlign="center">
          <Button onPress={onPress}/>
        </Layout_Item>
      </Layout>
    </Layout_Item>
  </Layout>
))
