import { xRay } from '@x-ray/core'
import { reactNativeSnapshots } from '@x-ray/plugin-react-native-snapshots'

export const main = async () => {
  const xRayReactNativeSnapshots = xRay(reactNativeSnapshots())

  await xRayReactNativeSnapshots([
    require.resolve('./examples/text1.tsx'),
    require.resolve('./examples/text2.tsx'),
    require.resolve('./examples/svg.tsx'),
  ])
}
