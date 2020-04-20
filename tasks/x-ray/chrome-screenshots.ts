import { xRay } from '@x-ray/core'
import { chromeScreenshots } from '@x-ray/plugin-chrome-screenshots'

export const main = async () => {
  const xRayChromeScreenshots = xRay(chromeScreenshots())

  await xRayChromeScreenshots([
    require.resolve('./examples/button.tsx'),
    require.resolve('./examples/input.tsx'),
    require.resolve('./examples/paragraph.tsx'),
    require.resolve('./examples/select.tsx'),
  ])
}
