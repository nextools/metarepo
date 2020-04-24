import { xRay } from '@x-ray/core'
import { androidScreenshots } from '@x-ray/plugin-android-screenshots'

export const main = async () => {
  const xRayAndroidScreenshots = xRay(androidScreenshots())

  await xRayAndroidScreenshots([
    require.resolve('./examples/text1.tsx'),
    require.resolve('./examples/text2.tsx'),
    require.resolve('./examples/svg.tsx'),
  ])
}
