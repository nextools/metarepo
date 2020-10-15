import { getAppPage } from 'foreal'
import test from 'tape'

test('revert/layout: test', async () => {
  const fixturePath = require.resolve('./fixtures/simple.tsx')

  const page = await getAppPage({
    entryPointPath: fixturePath,
  })

  const left = await page.$eval('[data-id="slider"]', (el) => {
    return (el as HTMLElement).offsetLeft
  })

  await page.mouse.move(left + 10, 10)
  await page.mouse.down()
  await page.waitForSelector('[data-id="slider-overlay"]')
  await page.mouse.move(left + 100, 10)
  await page.mouse.up()

  const newLeft = await page.$eval('[data-id="slider"]', (el) => {
    return (el as HTMLElement).offsetLeft
  })

  console.log(left)
  console.log(newLeft)

  await page.close()
})
